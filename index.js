// 格式转换处理后的图像转为文件输出
function createFileFromDataURL(dataURL, toType, fileName, lastModified) {
  return fetch(dataURL)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new File([blob], fileName, {
          lastModified: lastModified,
          type: `image/${toType}`,
        })
    );
}

// 图像 url 转为 File 文件形式
export function urlTransformToFile(url) {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const fileName = url.substring(url.lastIndexOf("/") + 1);
      const type = url.substring(url.lastIndexOf(".") + 1);
      return new File([blob], fileName, { type: `image/${type}` });
    });
}

/**
 * 检测浏览器是否支持传入的格式
 * @param toType 传入的格式
 * @returns boolean true/false
 */
function typeSupported(toType) {
  const elem = document.createElement("canvas");
  return elem.toDataURL(`image/${toType}`).indexOf(`data:image/${toType}`) == 0;
}

/**
 * 转换格式，默认转换 webp 格式
 * @param fileOrUrl 待转换的文件/图像url
 * @param toType 期望转换的类型，默认是webp
 * @param options canvas 转换参数
 * @returns 转换后的 File 文件对象
 */
export async function toTransform(
  fileOrUrl,
  toType = "webp",
  options = {
    quality: 1,
    color_space_conversion: true,
    alpha_filtering: "best",
    alpha_compression: "best",
  }
) {
  const isUrl = typeof fileOrUrl === "string";
  let realFile = isUrl ? await urlTransformToFile(fileOrUrl) : fileOrUrl;
  console.log(realFile, "realFile");
  const isTypeSupported = typeSupported(toType);
  const isToType = realFile.type === `image/${toType}`;
  return new Promise((resolve, reject) => {
    if (isTypeSupported && !isToType) {
      // 当浏览器支持 传入 格式且上传的图片不是 传入 格式的时候才需要做转换
      const reader = new FileReader();
      reader.onload = () => {
        const pngImage = new Image();
        pngImage.src = reader.result;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        pngImage.onload = () => {
          canvas.width = pngImage.width;
          canvas.height = pngImage.height;
          ctx?.drawImage(pngImage, 0, 0);

          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);

              reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                  const webpCanvas = document.createElement("canvas");
                  webpCanvas.width = img.width;
                  webpCanvas.height = img.height;

                  const webpCtx = webpCanvas.getContext("2d");
                  webpCtx?.drawImage(img, 0, 0);

                  const webPDataURL = webpCanvas.toDataURL(
                    `image/${toType}`,
                    options
                  );
                  // 文件重命名
                  const fileName = realFile.name?.replace(
                    /\.\w+$/,
                    `.${toType}`
                  );

                  createFileFromDataURL(
                    webPDataURL,
                    toType,
                    fileName,
                    realFile.lastModified
                  ).then((file) => {
                    resolve(file);
                  });
                };
              };
            },
            `image/${toType}`,
            options.quality
          );
        };
      };
      reader.readAsDataURL(realFile);
    } else {
      resolve(realFile);
    }
  });
}

/**
 * 上传图片添加水印
 * @param {*} file 图片文件
 * @param {*} waterMarkText 水印文字
 * @param {*} font 水印字号大小和字体
 * @param {*} fillStyle 水印样式
 * @returns
 */
export function toAddWaterMark(
  file,
  waterMarkText = " waterMark ",
  font = "12px arial",
  fillStyle = "rgba(255, 0, 0, .2)"
) {
  if (!file) {
    return;
  }
  const type = file.type;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        ctx.textBaseline = "bottom";
        ctx.transform(1, 0.5, -0.5, 1, 0, -canvas.height / 2);

        const wmHeight = img.height / 6;
        waterMarkText = Array(
          Math.ceil(canvas.width / ctx.measureText(waterMarkText).width) * 2
        ).join(waterMarkText);
        for (let i = 0; i < Math.ceil(canvas.height / wmHeight) * 2; i++) {
          ctx.fillText(waterMarkText, 0, i * wmHeight);
        }

        const dataURL = canvas.toDataURL(type);
        createFileFromDataURL(dataURL, file.name, file.lastModified).then(
          (result) => {
            resolve(result);
          }
        );
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}
