import remarkParse from 'remark-parse'
import remarkBreaks from 'remark-breaks'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkImgLinks from '@pondorasti/remark-img-links'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

import cmake from 'highlight.js/lib/languages/cmake'
import dart from 'highlight.js/lib/languages/dart'
import django from 'highlight.js/lib/languages/django'
import dns from 'highlight.js/lib/languages/dns'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import dos from 'highlight.js/lib/languages/dos'
import gradle from 'highlight.js/lib/languages/gradle'
import groovy from 'highlight.js/lib/languages/groovy'
import handlebars from 'highlight.js/lib/languages/handlebars'
import http from 'highlight.js/lib/languages/http'
import llvm from 'highlight.js/lib/languages/llvm'
import nginx from 'highlight.js/lib/languages/nginx'
import powershell from 'highlight.js/lib/languages/powershell'
import properties from 'highlight.js/lib/languages/properties'
import protobuf from 'highlight.js/lib/languages/protobuf'
import vbscript from 'highlight.js/lib/languages/vbscript'

import { visit } from 'unist-util-visit'
import { h } from 'hastscript'

const remarkConfig = {
    settings: {
        bullet: "*"
    },
    plugins: [
        remarkParse,
        remarkBreaks,
        remarkFrontmatter,
        remarkGfm,
        // [remarkImgLinks, {
        //     absolutePath: "https://xxx.xxx.com/"
        // }],
        remarkDirective,
        myRemarkPlugin,
        [remarkRehype, {
            allowDangerousHtml: true
        }],
        [rehypeHighlight, {
            ignoreMissing: true,
            languages: {
                cmake, dart, django, dns, dockerfile, dos, gradle, groovy, handlebars, http, llvm, nginx, powershell, properties, protobuf, vbscript
            }
        }],
        [rehypeStringify, {
            allowDangerousHtml: true
        }]
    ]
}

// `:::note` を `<div class="flash mt-3"></div>にします。`
function myRemarkPlugin() {
    return (tree) => {
        visit(tree, (node) => {
            if (
                node.type === 'textDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'containerDirective'
            ) {
                if (node.name !== 'note') return

                const data = node.data || (node.data = {})
                const tagName = node.type === 'textDirective' ? 'span' : 'div'

                data.hName = tagName
                data.hProperties = h(tagName, { class: 'flash mt-3' }).properties
            }
        })
    }
}

export default remarkConfig
