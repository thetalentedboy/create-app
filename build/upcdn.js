import path from 'path';
import fs from 'fs'
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';
const assetPath = isDev ? 'dev-template' : 'template';
export const cdnUploadUrl = 'https://exmple.com/upload'

	(async () => {
		console.log('文件上传CDN中');
		const m = await fs.promises.readFile(path.resolve(__dirname, '../dist/manifest.json'))
		const manifest = JSON.parse(m);

		const uploadRequest = Object.values(manifest).map(url => {
			const filePath = path.join(__dirname, '../dist', url.replace(`/assets/${assetPath}`, ""))
			const formData = new FormData();

			formData.append('file', fs.createReadStream(filePath));
			formData.append('dir', url);

			return axios
				.post(cdnUploadUrl, formData, {
					headers: {
						'Auth': '',
						'Content-Type': 'multipart/form-data'
					}
				})
				.then(({ data }) => {
					if (data.no !== 0) throw new Error(data.data);
					console.log(`upload file: ${data.data}`);

				}).catch(error => console.log(error, "err"));
		}) || [];

		await Promise.all(uploadRequest);
		console.log('文件上传完成');
	})();
