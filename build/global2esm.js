import fs from "node:fs/promises"
import { JSDOM } from "jsdom";
import inquirer from "inquirer";

inquirer.prompt([{
	type: "input",
	message: "请输入模板名称",
	name: "template_name",
	default: "",
}]).then(({ template_name }) => {

	const inputHTMLPath = `./src/template/${template_name}/index.html`;
	const outputJSPath = `./src/template/${template_name}/index.js`;
	const outputHTMLPath = `./src/template/${template_name}/index.html`;

	fs.readFile(inputHTMLPath, 'utf-8').then(r => {
		const dom = new JSDOM(r);
		const document = dom.window.document;

		let indexJsContent = ""
		let indexCssContent = ""

		indexJsContent += `import "./index.css";\n`
		document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
			let url = link.href
			if (url.startsWith('https://')) return
			if (!url.startsWith('.')) url = "." + url
			indexJsContent += `import '${url}';\n`;
			link.remove()
		});

		document.querySelectorAll('script[src]').forEach(script => {
			let url = script.src
			if (url.startsWith('https://')) return
			if (!url.startsWith('.')) url = "." + url
			indexJsContent += `import '${url}';\n`;
			script.remove()
		});

		document.querySelectorAll('script').forEach(script => {
			indexJsContent += `${script.textContent}\n\n`;
			script.remove();
		});


		fs.appendFile(outputJSPath, indexJsContent, err => {
			if (err) {
				console.error("Error writing index.js:", err);
			}
		});

		document.querySelectorAll('style').forEach(style => {
			indexCssContent += style.textContent;
			style.remove();
		});

		fs.writeFile(`${outputJSPath.replace('.js', '.css')}`, indexCssContent)

		fs.writeFile(outputHTMLPath, dom.serialize(), err => {
			if (err) {
				console.error("Error writing modified HTML file:", err);
			};
		});
	})
})


