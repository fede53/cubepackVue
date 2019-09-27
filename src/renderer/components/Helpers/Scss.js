var nodefs = require('node-fs');
var path = require('path');
var sass = __non_webpack_require__('node-sass');
var postcss = require('postcss');
var eyeglass = require('eyeglass');
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
/**
 * @constructor
 */
function ProcessorNew() {
}

/**
 * Process single
 */
ProcessorNew.prototype.process = function (options) {

	// Wrap node-sass in a promise.
	var sassPromise = new Promise(function (resolve, reject) {
		sass.render(eyeglass({
			file: options.from,
			outFile: options.to,
			precision: 10,
			sourceMap: true,
			sourceMapEmbed: true,
			importer: options.importer || null
		}), function (err, result) {
			if (err) {
				reject(err);
			}
			else {
			    //console.log(result)
				resolve(result);
			}
		});
	});

	// PostCss already implements promises, so we just return it.
	var doPostCss = (result) => {
        const root = postcss.parse(result.css)
        root.replaceValues(/url\((.*?)\)/g, {}, string => {
            string = string.replace(/url\((.*?)\)/g,
                (fullMatch, urlMatch) => {
                return 'url( ../newassets/' + path.basename(trimUrlValue(urlMatch)) + ')';
                }
            );
            return string
        })
        var mapContent = JSON.parse(result.map.toString());
        var sources = mapContent.sources;
        var files = [];
        var currentSassFile = ''
        for( currentSassFile of sources) {
            if( !currentSassFile.includes('already-imported') ) {
                var sourceName = path.resolve(path.dirname(options.from), currentSassFile);
                var sourceContent = nodefs.readFileSync(path.resolve(path.dirname(options.from), currentSassFile));
                sourceContent.toString().replace(/url\((.*?)\)/g,
                    function (fullMatch, urlMatch) {
                        urlMatch = trimUrlValue(urlMatch);
                        files.push({
                            fileName: path.basename(urlMatch).split("?").shift().split("#").shift(),
                            fileFolder: path.dirname(sourceName)
                        });
                    });
            }
        }
        var sourceContent = result.css.toString();
        sourceContent = sourceContent.replace(/url\((.*?)\)/g,
            function (fullMatch, urlMatch) {
                var urlMatchFileName = path.basename(trimUrlValue(urlMatch));
                for( var i=0; i<files.length; i++) {
                    if( urlMatchFileName == files[i].fileName ) {
                        var fullFileName = path.resolve(files[i].fileFolder, trimUrlValue(urlMatch));
                        var content = nodefs.readFileSync(fullFileName);
                        try {
                            var newFileName = path.dirname(options.to) + '/../newassets/' + files[i].fileName;
                            if( !nodefs.existsSync(newFileName) || nodefs.statSync(fullFileName) > nodefs.statSync(newFileName) ) {
                                nodefs.writeFileSync(path.dirname(options.to) + '/../newassets/' + files[i].fileName, content);
                            }
                        } catch (e) {
                            console.log('Error copyng file');
                        }
                    }
                }
            }
        );
        var toName = path.basename(options.to);
		return  postcss([autoprefixer(['> 5%', 'last 2 versions', 'ie > 7']), cssnano()]).process(root.toString(), {
			from: toName,
			to: toName,
			map: { inline: false }
		});
	};

	// Write results to disk.
	var writeToDisk = (result) => {
		nodefs.mkdirSync(path.dirname(options.to), '0777', true);
		nodefs.writeFileSync(options.to, result.css);
		if (!options.sourceMapDisabled) {
			nodefs.writeFileSync(options.to + '.map', result.map);
		}
    };
     
	var trimUrlValue = (value) => {
        var beginSlice, endSlice;
        value = value.trim();
        beginSlice = value.charAt(0) === '\'' || value.charAt(0) === '"' ? 1 : 0;
        endSlice = value.charAt(value.length - 1) === '\'' ||
        value.charAt(value.length - 1) === '"' ?
            -1 : undefined;
        return value.slice(beginSlice, endSlice).trim();
    }

    var removeURL = (value) => {
	    return value.replace('url("', '').replace("url('", '')
    }

	return sassPromise
		.then(doPostCss)
		.then(writeToDisk);
};


/**
 * Process many
 */
ProcessorNew.prototype.processMany = function (optionsArray) {
	var proms = optionsArray.map((item) => this.process(item));
	return Promise.all(proms);
};


export default new ProcessorNew()