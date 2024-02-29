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
