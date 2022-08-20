import remarkParse from 'remark-parse'
import remarkBreaks from 'remark-breaks'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import remarkImgLinks from '@pondorasti/remark-img-links'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkCollapse from 'remark-collapse'

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
        [remarkToc, { heading: '目次', tight: true }],
        [remarkCollapse, {test: '目次', summary: '目次を開く'}],
        [remarkImgLinks, {
            absolutePath: "https://image.xxx.com/"
        }],
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
        }],
        rehypeSlug,
        [rehypeAutolinkHeadings, {
            content: [
                h('span.anchor',
                    h('svg.octicon.octicon-link', {
                        viewBox: '0 0 16 16',
                        version: '1.1',
                        width: '16',
                        height: '16',
                        'aria-hidden': 'true'
                    },
                        h('path', {
                            'fill-rule': 'evenodd',
                            'd': 'M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'
                        })))
            ]
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
                if (node.name == 'note') {
                    const data = node.data || (node.data = {})
                    const tagName = node.type === 'textDirective' ? 'span' : 'div'

                    data.hName = tagName
                    data.hProperties = h(tagName, { class: 'flash mt-3' }).properties
                } else if (node.name == 'note-info') {
                    const data = node.data || (node.data = {})
                    const tagName = node.type === 'textDirective' ? 'span' : 'div'

                    data.hName = tagName
                    data.hProperties = h(tagName, { class: 'flash mt-3' }).properties
                } else if (node.name == 'note-warn') {
                    const data = node.data || (node.data = {})
                    const tagName = node.type === 'textDirective' ? 'span' : 'div'

                    data.hName = tagName
                    data.hProperties = h(tagName, { class: 'flash mt-3 flash-warn' }).properties
                } else if (node.name == 'note-alert') {
                    const data = node.data || (node.data = {})
                    const tagName = node.type === 'textDirective' ? 'span' : 'div'

                    data.hName = tagName
                    data.hProperties = h(tagName, { class: 'flash mt-3 flash-error' }).properties
                } else if (node.name == 'note-success') {
                    const data = node.data || (node.data = {})
                    const tagName = node.type === 'textDirective' ? 'span' : 'div'

                    data.hName = tagName
                    data.hProperties = h(tagName, { class: 'flash mt-3 flash-success' }).properties
                }
            }
        })
    }
}

export default remarkConfig
