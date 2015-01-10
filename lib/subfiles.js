(function() {
	"use strict";

	require("es6-promise").polyfill();

	var _ = require("underscore");
	var fs = require("fs-extra");
	var git = require("gift");
	var path = require("path");
	var process = require("process");

	var promises = [];
	var cwd = process.cwd();
	var jsonPath = path.join(cwd, "subfiles.json");
	var downloadSubfiles = function(configs, count) {
		var repodir = "/tmp/git-subfile-" + _.random(0, 999999);

		if (configs.length <= count) {
			return;
		}

		if (count === undefined) {
			count = 0;
		}

		console.info("Cloning " + configs[count].repo + " and Extracting files...");

		git.clone(configs[count].repo, repodir, function(err) {
			if (err) {
				if (err.code === 128) {
					console.error("Error: Failed to clone repository " + configs[count].repo);
					console.error(err.message);
					process.exit(1);
				}

				console.error("Error: Unknown error occured. Report this to the author.");
				throw err;
			}

			if (!Array.isArray(configs[count].files)) {
				configs[count].files = [configs[count].files];
			}

			promises = [];

			configs[count].files.forEach(function(copyfile) {
				promises.push(new Promise(function(resolve, reject) {
					var src = path.join(repodir, copyfile.src);
					var dest = path.join(cwd, copyfile.dest);

					if (!fs.existsSync(src)) {
						reject(new Error("File " + copyfile.src + " doesn't exist in repository " + configs[count].repo));
					}

					// TODO If checksum of src and dest is the same, do not copy and console.info(src + " is up to date")

					fs.copy(src, dest, function(err) {
						if (err) {
							reject(err);
						} else {
							console.info("Copied " + copyfile.src + " from " + configs[count].repo);
							resolve();
						}
					});
				}));
			});

			Promise.all(promises).then(function() {
				fs.remove(repodir, function() {
					// TODO add files into .gitignore
					downloadSubfiles(configs, count + 1);
				});
			}).catch(function(err) {
				console.error(err.stack);
				process.exit(1);
			});
		});
	};

	exports.downloadSubfiles = function() {
		if (fs.existsSync(jsonPath)) {
			var configs = require(jsonPath);
			downloadSubfiles(configs);
		} else {
			console.info("No subfiles.json found in this directory.");
		}
	};
}());
