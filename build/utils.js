import { glob } from 'glob'
import fs from 'fs/promises';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export function batchEntry() {
    const entry = {};
    const plugins = [];

    return glob(['./src/template/*']).then(t => {
        t.forEach((i) => {
            const name = i.split('/').pop();
            entry[name] = `./${i}/index.js`;

            plugins.push(
                new HtmlWebpackPlugin({
                    template: entry[name].replace('.js', '.html'),
                    filename: `${name}/index.html`,
                    chunks: [name],
                    inject: 'head',
                    minify: {
                        removeRedundantAttributes: false
                    }
                })
            );
        });

        return {
            entry,
            plugins
        };
    })
}

export function loaderGetEntryName(filename, mark) {
    const fileTree = filename.split('/')
    const index = fileTree.indexOf('template')
    return fileTree[index + 1]
}


export function generateVersion(_, files) {
    const v = {}
    files.filter(i => !i.isAsset && i.chunk).forEach(i => {
        const chunkname = i.chunk.name

        if (!v[chunkname]) v[chunkname] = {}

        const assetKey = i.name.replace(`${chunkname}.`, '')
        v[chunkname][assetKey] = i.path
    })
    console.log(v, 111);
    fs.writeFile('./build/build.json', JSON.stringify(v), (err) => { console.log(err); })

    const list = {}
    files.forEach(i => list[i.name] = i.path)
    return list
}

