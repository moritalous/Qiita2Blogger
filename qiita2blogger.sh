#/bin/sh

if [ $# -ne 1 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには1個の引数（Qiita Post ID）が必要です。" 1>&2
  exit 1
fi

export WORK_DIR=$1
export QIITA_POST_ID=$1

export BLOG_ID=

export MC_ALIAS=
export MC_BUCKET=

mkdir ${WORK_DIR}

wget "https://qiita.com/api/v2/items/${QIITA_POST_ID}" -O ${WORK_DIR}/${QIITA_POST_ID}.json

# Save Markdown file
cat ${WORK_DIR}/${QIITA_POST_ID}.json | jq -r '.body' > ${WORK_DIR}/${QIITA_POST_ID}.md

# Save Images to Local
cat ${WORK_DIR}/${QIITA_POST_ID}.md | grep '\!\[' | cut -d ']' -f 2 | cut -d '(' -f 2 | cut -d ')' -f 1 > ${WORK_DIR}/${QIITA_POST_ID}.image-list.txt;
wget -i ${WORK_DIR}/${QIITA_POST_ID}.image-list.txt -x -nH -P ${WORK_DIR}/images;

# Save Metadata files
cat ${WORK_DIR}/${QIITA_POST_ID}.json | jq -r '.title' > ${WORK_DIR}/${QIITA_POST_ID}.title.txt;
cat ${WORK_DIR}/${QIITA_POST_ID}.json | jq -r '.tags[].name' > ${WORK_DIR}/${QIITA_POST_ID}.tags.txt;
cat ${WORK_DIR}/${QIITA_POST_ID}.json | jq -r '.created_at' > ${WORK_DIR}/${QIITA_POST_ID}.created_at.txt; 

# Replace Qiita Image URL to Relative Path
sed -i -e 's/https:\/\/qiita-image-store.s3.amazonaws.com/images/g' ${WORK_DIR}/${QIITA_POST_ID}.md;
sed -i -e 's/https:\/\/qiita-image-store.s3.ap-northeast-1.amazonaws.com/images/g' ${WORK_DIR}/${QIITA_POST_ID}.md;

# Convert Markdown to HTML
docker run --rm  -u `id -u`:`id -g` -v `pwd`:/work -w /work --entrypoint npx node:lts -y remark-cli ${WORK_DIR}/${QIITA_POST_ID}.md --output ${WORK_DIR}/${QIITA_POST_ID}.html

# Upload Images
docker run --rm  -v `pwd`:/work -v `pwd`/.mc:/root/.mc -w /work minio/mc cp --recursive /work/${WORK_DIR}/images ${MC_ALIAS}/${MC_BUCKET}/

# Post to Blogger
docker run -it --rm  -u `id -u`:`id -g` -v `pwd`:/work -w /work --net host --entrypoint /work/.venv/bin/python python:3.8 qiita2blogger.py ${WORK_DIR} ${QIITA_POST_ID} ${BLOG_ID}
