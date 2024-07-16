import axios from "axios";
import fs from "fs"
import FormData from "form-data";
import { cdnUploadUrl } from "./upcdn";


const isDev = process.env.NODE_ENV === 'development';
const assetPath = isDev ? 'dev-template' : 'template';
const assetHttpUrl = 'https://exmple.com/assets'

function writeVersion() {
	fs.promises.readFile('./build/build.json').then(async (t) => {
		const mergedVersions = await mergeVersion(JSON.parse(t))
		fs.writeFileSync('./build/version.json', JSON.stringify(mergedVersions), 'utf-8')

		const formData = new FormData()
		formData.append('file', fs.createReadStream('./build/version.json'))
		formData.append('dir', `assets/${assetPath}`)

		axios.post(cdnUploadUrl, formData, {
			headers: {
				'Auth': '',
				'Content-Type': 'multipart/form-data'
			}
		}).then(({ data }) => {
			if (data.no !== 0) throw new Error(data.data);
			console.log(`upload version file: ${data.data}`);
		}).catch(error => console.log(error, "err"));
	})
}

function mergeVersion(tempVersions) {
	return axios.get(`${assetHttpUrl}/${assetPath}/version.json`).then(res => {
		const onlineList = res.data
		const templates = Object.keys(tempVersions)
		const mergedList = JSON.parse(JSON.stringify(onlineList))

		templates.forEach(t => {
			const buildAssetInfo = tempVersions[t]

			if (!onlineList[t]) {
				mergedList[t] = [{
					version: 'v1.0.0',
					css: buildAssetInfo.css,
					js: buildAssetInfo.js,
				}]
			} else {
				const currentVersions = mergedList[t]
				const newestVersionInfo = onlineList[t].pop()
				const isNewVersion = newestVersionInfo.css !== buildAssetInfo.css || newestVersionInfo.js !== buildAssetInfo.js

				if (isNewVersion) {
					console.log(`${t}: ${newestVersionInfo.version} -> ${incrementPatchVersion(newestVersionInfo.version)}`);

					currentVersions.push({
						version: incrementPatchVersion(newestVersionInfo.version),
						css: buildAssetInfo.css,
						js: buildAssetInfo.js
					})
				}
			}
		})

		return mergedList
	})
}

function incrementPatchVersion(version) {
	let parts = version.split('.');
	let patch = parseInt(parts[2], 10);
	patch++;
	parts[2] = patch.toString();
	return parts.join('.');
}

writeVersion()
