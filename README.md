
# Setup

## Python env

```
docker run --rm  -u `id -u`:`id -g` -v `pwd`:/work -w /work --entrypoint python python:3.8 -m venv .venv

docker run --rm  -u `id -u`:`id -g` -v `pwd`:/work -w /work --entrypoint /work/.venv/bin/python python:3.8 -m pip install -r requirements.txt
```

## Node env

```
docker run --rm  -u `id -u`:`id -g` -v `pwd`:/work -w /work --entrypoint npm node:lts install
```


# Config

## `mc alias set`

```
docker run --rm  -v `pwd`:/work -v `pwd`/.mc:/root/.mc -w /work minio/mc alias set --help
```

```
NAME:
  mc alias set - set a new alias to configuration file

USAGE:
  mc alias set ALIAS URL ACCESSKEY SECRETKEY

FLAGS:
  --path value                  bucket path lookup supported by the server. Valid options are '[auto, on, off]' (default: "auto")
  --api value                   API signature. Valid options are '[S3v4, S3v2]'
  --config-dir value, -C value  path to configuration folder (default: "/root/.mc")
  --quiet, -q                   disable progress bar display
  --no-color                    disable color theme
  --json                        enable JSON lines formatted output
  --debug                       enable debug output
  --insecure                    disable SSL certificate verification
  --help, -h                    show help
  
EXAMPLES:
  1. Add MinIO service under "myminio" alias. For security reasons turn off bash history momentarily.
     $ set +o history
     $ mc alias set myminio http://localhost:9000 minio minio123
     $ set -o history
  2. Add MinIO service under "myminio" alias, to use dns style bucket lookup. For security reasons
     turn off bash history momentarily.
     $ set +o history
     $ mc alias set myminio http://localhost:9000 minio minio123 --api "s3v4" --path "off"
     $ set -o history
  3. Add Amazon S3 storage service under "mys3" alias. For security reasons turn off bash history momentarily.
     $ set +o history
     $ mc alias set mys3 https://s3.amazonaws.com \
                 BKIKJAA5BMMU2RHO6IBB V8f1CwQqAcwo80UEIJEjc5gVQUSSx5ohQ9GSrr12
     $ set -o history
  4. Add Amazon S3 storage service under "mys3" alias, prompting for keys.
     $ mc alias set mys3 https://s3.amazonaws.com --api "s3v4" --path "off"
     Enter Access Key: BKIKJAA5BMMU2RHO6IBB
     Enter Secret Key: V8f1CwQqAcwo80UEIJEjc5gVQUSSx5ohQ9GSrr12
  5. Add Amazon S3 storage service under "mys3" alias using piped keys.
     $ set +o history
     $ echo -e "BKIKJAA5BMMU2RHO6IBB\nV8f1CwQqAcwo80UEIJEjc5gVQUSSx5ohQ9GSrr12" | \
                 mc alias set mys3 https://s3.amazonaws.com --api "s3v4" --path "off"
     $ set -o history
```

## client_secrets.json

[https://github.com/googleapis/google-api-python-client/blob/main/docs/client-secrets.md](https://github.com/googleapis/google-api-python-client/blob/main/docs/client-secrets.md)

* Create token.json

```
docker run -it --rm  -u `id -u`:`id -g` -v `pwd`:/work -w /work --net host --entrypoint /work/.venv/bin/python python:3.8 create_token.py
```

## modify python src

```
export BLOG_ID=

export MC_ALIAS
export MC_BUCKET=
```

## Usage

./qiita2blogger.sh <Qiita_Post_id>
