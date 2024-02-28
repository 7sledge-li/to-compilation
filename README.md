# to-compilation

A helper for image type conversion and image compression.

## Install 安装

```bash
yarn add @sledgeli/to-compilation

# or

npm install --save @sledgeli/to-compilation
```

## Usage 使用示例，return 一个转换后的 File 文件对象

```js
import { toTransform, toCompress } from "@sledgeli/to-compilation";

const fileUrl = ref("");
const tarnsform = async () => {
  const file = await toTransform(fileUrl.value);
  console.log(file, "tarnsform");
};
const compress = async () => {
  const file = await toCompress(fileUrl.value);
  console.log(file, "compress");
};
```

## argument 参数 —— toTransform

| 参数名      | 说明                  | 类型             | 默认值                                                                                            | 是否必填 |
| ----------- | --------------------- | ---------------- | ------------------------------------------------------------------------------------------------- | -------- |
| `fileOrUrl` | 待转换的文件/图像 url | `File`或`string` |                                                                                                   | Yes      |
| `toType`    | 期望转换的类型        | `string`         | 'webp'                                                                                            | No       |
| `options`   | canvas 配置参数       | `object`         | { quality: 1, color_space_conversion: true, alpha_filtering: "best", alpha_compression: "best", } | No       |

## argument 参数 —— toCompress

| 参数名      | 说明                                                | 类型             | 默认值 | 是否必填 |
| ----------- | --------------------------------------------------- | ---------------- | ------ | -------- |
| `fileOrUrl` | 待转换的文件/图像 url                               | `File`或`string` |        | Yes      |
| `quality`   | canvas 压缩质量，目前只有 jpeg 格式的图像可正常压缩 | `number`         | 0.8    | No       |
