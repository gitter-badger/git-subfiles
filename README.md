git-subfiles
=============

Fetch files from other repository and place the file in repo directory

Usage
------

### 1) Create subfiles.json in the project root

Example:

    [
        {
            "repo": "git@github.com:phanect/coding-standards.git",
            "files": [
                { "src": "/javascript/.jshintrc", "dest": "/.jshintrc" },
                { "src": "/javascript/.jscs.json", "dest": "/.jscs.json" }
            ]
        },
        {
            "repo": "git@bitbucket.org:phanect/secrets.git",
            "files": { "src": "/secrets.json", "dest": "/config/secrets.json" }
        }
    ]

`repo` is URL of git repository.
`files` includes files to copy. If there are multiple files to copy in the repo, this should be array, but also single file can be accepted.
`files.src` is relative path to the file you want to copy from source repo root dir.
`files.dest` is destination relative path from the root dir of repo you want to copy to.

### 2) Run `subfiles` command

    cd PROJECT_ROOT
    subfiles
