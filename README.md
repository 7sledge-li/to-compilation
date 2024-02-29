# to-compilation

A helper for image type conversion and adding image watermark.

## Install 安装

```bash
yarn add @sledgeli/to-compilation

# or

npm install --save @sledgeli/to-compilation
```

## Usage 使用示例，return 一个转换后的 File 文件对象

```js
import { toTransform, toAddWaterMark } from "@sledgeli/to-compilation";

const fileUrl = ref("");
const tarnsform = async () => {
  const file = await toTransform(fileUrl.value);
  console.log(file, "tarnsform");
};

const addWaterMark = async () => {
  // fileUrl 需要先转换为 File 对象
  const wmFile = await toAddWaterMark(fileUrl.value);
  console.log(file, "watermark");
};
```

## argument 参数 —— toTransform

| 参数名      | 说明                  | 类型             | 默认值                                                                                            | 是否必填 |
| ----------- | --------------------- | ---------------- | ------------------------------------------------------------------------------------------------- | -------- |
| `fileOrUrl` | 待转换的文件/图像 url | `File`或`string` |                                                                                                   | Yes      |
| `toType`    | 期望转换的类型        | `string`         | 'webp'                                                                                            | No       |
| `options`   | canvas 配置参数       | `object`         | { quality: 1, color_space_conversion: true, alpha_filtering: "best", alpha_compression: "best", } | No       |

## argument 参数 —— toAddWaterMark

| 参数名          | 说明                  | 类型     | 默认值                | 是否必填 |
| --------------- | --------------------- | -------- | --------------------- | -------- |
| `file`          | 待添加水印的图片文件  | `File`   |                       | Yes      |
| `waterMarkText` | 水印文字              | `string` | ' waterMark '         | No       |
| `font`          | 水印字号大小和字体    | `string` | "12px arial"          | No       |
| `fillStyle`     | 水印样式—颜色和透明度 | `string` | "rgba(255, 0, 0, .2)" | No       |
