<template>
    <div>
        <v-card
            elevation="2"
            v-if="!disabled"
            class="mb-2 pa-2 d-flex justify-space-between"
        >
            <div>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="bold"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>format_bold</v-icon>
                        </v-btn>
                    </template>
                    <span>Bold text (CTRL+B)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="italic"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>format_italic</v-icon>
                        </v-btn>
                    </template>
                    <span>Italics (CTRL+I)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="link"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>insert_link</v-icon>
                        </v-btn>
                    </template>
                    <span>Insert Link (CTRL+L)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="quote"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>format_quote</v-icon>
                        </v-btn>
                    </template>
                    <span>Blockquote (CTRL+Q)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="image"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>insert_photo</v-icon>
                        </v-btn>
                    </template>
                    <span>Insert Image (CTRL+SHIFT+L)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="code"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>code</v-icon>
                        </v-btn>
                    </template>
                    <span>Insert Code (CTRL+&lt;)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="heading"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>format_size</v-icon>
                        </v-btn>
                    </template>
                    <span>H2 Heading (CTRL+H)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small icon @click="ol" v-bind="attrs" v-on="on">
                            <v-icon>format_list_numbered</v-icon>
                        </v-btn>
                    </template>
                    <span>Numbered List (ALT+1)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn small icon @click="ul" v-bind="attrs" v-on="on">
                            <v-icon>format_list_bulleted</v-icon>
                        </v-btn>
                    </template>
                    <span>Bulleted List (ALT+-)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="strikethrough"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>format_strikethrough</v-icon>
                        </v-btn>
                    </template>
                    <span>Strike Through (ALT+S)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="latex"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>functions</v-icon>
                        </v-btn>
                    </template>
                    <span>LaTeX Equations (CTRL+M)</span>
                    <LatexDialog
                        :showDialog="latexDialog"
                        :defaultValue="currentSelected"
                        @cancel="latexDialog = false"
                        @insertLatex="insertLatex"
                    />
                </v-tooltip>
            </div>
            <div>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="undoAction"
                            v-bind="attrs"
                            v-on="on"
                            class="ml-4"
                        >
                            <v-icon>undo</v-icon>
                        </v-btn>
                    </template>
                    <span>Undo (CTRL+Z)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            small
                            icon
                            @click="redoAction"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>redo</v-icon>
                        </v-btn>
                    </template>
                    <span>Redo (CTRL+SHIFT+Z)</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <a
                            class="
                                btn btn--icon btn--small
                                text-decoration-none
                                ml-4
                            "
                            target="_blank"
                            href="https://guides.github.com/features/mastering-markdown/"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>help_outline</v-icon>
                        </a>
                    </template>
                    <span>Formatting help</span>
                </v-tooltip>
            </div>
        </v-card>
        <v-textarea
            ref="txt"
            :label="label"
            :spellcheck="!value || value.indexOf('```') === -1"
            :counter="counter"
            multi-line
            auto-grow
            :rows="rows || 6"
            :disabled="disabled"
            :rules="rules"
            :value="value"
            :error-messages="errorMessages"
            @input="(v) => $emit('input', v)"
            solo
        ></v-textarea>
    </div>
</template>

<style>
.v-dialog {
    overflow: visible;
}
math-field:focus,
math-field:focus-within {
    outline: none;
}
.ML__keyboard {
    z-index: 203;
}
</style>

<script>
// Code modified from https://github.com/ServiceStack/servicestack-editor
import 'mathlive'
import LatexDialog from '../components/LatexDialog'

export default {
    components: {
        LatexDialog,
    },
    data() {
        return {
            latexDialog: false,
            latexValue: undefined,
            currentSelected: undefined,
            history: [],
            redo: [],
        }
    },
    props: [
        'label',
        'value',
        'defaultValue',
        'counter',
        'rows',
        'rules',
        'errorMessages',
        'lang',
        'autofocus',
        'disabled',
    ],

    methods: {
        latex(e) {
            e.stopPropagation()
            this.currentSelected = this.selectionInfo().sel
            this.latexDialog = true
        },
        insertLatex(value) {
            // Calculate new textarea contents
            const selection = this.selectionInfo()
            const newValue =
                selection.beforeSel +
                value +
                selection.afterSel.slice(selection.sel.length)
            this.$emit('input', newValue)

            // Reset latex input and close dialog
            this.latexDialog = false
        },
        input() {
            return this.$refs.txt.$refs.input
        },
        hasSelection() {
            return this.input().selectionStart !== this.input().selectionEnd
        },
        selection() {
            const $txt = this.input()
            return (
                $txt.value.substring($txt.selectionStart, $txt.selectionEnd) ||
                ''
            )
        },
        selectionInfo() {
            const $txt = this.input()
            const value = $txt.value,
                selPos = $txt.selectionStart,
                sel = value.substring(selPos, $txt.selectionEnd) || '',
                beforeSel = value.substring(0, selPos),
                prevCRPos = beforeSel.lastIndexOf('\n')
            return {
                value,
                sel,
                selPos,
                beforeSel,
                afterSel: value.substring(selPos),
                prevCRPos,
                beforeCR:
                    prevCRPos >= 0 ? beforeSel.substring(0, prevCRPos + 1) : '',
                afterCR:
                    prevCRPos >= 0 ? beforeSel.substring(prevCRPos + 1) : '',
            }
        },
        replace({ value, selectionStart, selectionEnd }) {
            if (selectionEnd === null) {
                selectionEnd = selectionStart
            }
            const $txt = this.input()
            this.$emit('input', value)
            this.$nextTick(() => {
                $txt.focus()
                $txt.setSelectionRange(selectionStart, selectionEnd)
            })
        },
        insert(
            prefix,
            suffix,
            placeholder,
            {
                selectionAtEnd,
                offsetStart,
                offsetEnd,
                filterValue,
                filterSelection,
            } = {},
        ) {
            const $txt = this.input()

            let value = $txt.value
            let pos = $txt.selectionEnd
            this.history.push({
                value,
                selectionStart: $txt.selectionStart,
                selectionEnd: $txt.selectionEnd,
            })
            this.redo = []
            const from = $txt.selectionStart,
                to = $txt.selectionEnd
            const beforeRange = value.substring(0, from)
            const afterRange = value.substring(to)
            const toggleOff =
                prefix &&
                beforeRange.endsWith(prefix) &&
                afterRange.startsWith(suffix)

            const noSelection = from === to
            if (noSelection) {
                if (!toggleOff) {
                    value =
                        beforeRange + prefix + placeholder + suffix + afterRange
                    pos += prefix.length
                    offsetStart = 0
                    offsetEnd = placeholder.length
                    if (selectionAtEnd) {
                        pos += offsetEnd
                        offsetEnd = 0
                    }
                } else {
                    value =
                        beforeRange.substring(
                            0,
                            beforeRange.length - prefix.length,
                        ) + afterRange.substring(suffix.length)
                    pos += -suffix.length
                }
                if (filterValue) {
                    const opt = { pos }
                    value = filterValue(value, opt)
                    pos = opt.pos
                }
            } else {
                let selectedText = value.substring(from, to)
                if (filterSelection) {
                    selectedText = filterSelection(selectedText)
                }

                if (!toggleOff) {
                    value =
                        beforeRange +
                        prefix +
                        selectedText +
                        suffix +
                        afterRange

                    if (offsetStart) {
                        pos += (prefix + suffix).length
                    } else {
                        pos = from
                        offsetStart = prefix.length
                        offsetEnd = selectedText.length
                    }
                } else {
                    value =
                        beforeRange.substring(
                            0,
                            beforeRange.length - prefix.length,
                        ) +
                        selectedText +
                        afterRange.substring(suffix.length)
                    offsetStart = -selectedText.length - prefix.length
                    offsetEnd = selectedText.length
                }
            }

            this.$emit('input', value)
            this.$nextTick(() => {
                $txt.focus()
                offsetStart = pos + (offsetStart || 0)
                offsetEnd = offsetStart + (offsetEnd || 0)
                $txt.setSelectionRange(offsetStart, offsetEnd)
            })
        },
        bold() {
            this.insert('**', '**', 'bold')
        },
        italic() {
            this.insert('_', '_', 'italics')
        },
        strikethrough() {
            this.insert('~~', '~~', 'strikethrough')
        },
        link() {
            this.insert('[', '](http://)', '', {
                offsetStart: -8,
                offsetEnd: 7,
            })
        },
        quote() {
            this.insert('\n> ', '\n', 'Blockquote', {})
        },
        image() {
            this.insert('![', '](http://)', 'alt text', {
                offsetStart: -8,
                offsetEnd: 7,
            })
        },
        code(e) {
            const sel = this.selection()
            if (sel && !e.shiftKey) {
                this.insert('`', '`', 'code')
            } else {
                const lang = this.lang || 'js'
                const partialSel = sel.indexOf('\n') === -1
                if (partialSel) {
                    this.insert('\n```' + lang + '\n', '\n```\n', '// code')
                } else {
                    this.insert('```' + lang + '\n', '```\n', '')
                }
            }
        },
        ol() {
            if (this.hasSelection()) {
                // eslint-disable-next-line no-unused-vars
                const { sel, selPos, afterSel, prevCRPos, beforeCR, afterCR } =
                    this.selectionInfo()
                let beforeSel = this.selectionInfo()
                const partialSel = sel.indexOf('\n') === -1
                if (!partialSel) {
                    const indent = !sel.startsWith(' 1. ')
                    if (indent) {
                        let index = 1
                        this.insert('', '', ' - ', {
                            selectionAtEnd: true,
                            filterSelection: (v) =>
                                ' 1. ' +
                                v
                                    .replace(/\n$/, '')
                                    .replace(/\n/g, () => `\n ${++index}. `) +
                                '\n',
                        })
                    } else {
                        this.insert('', '', '', {
                            filterValue: (v, opt) => {
                                if (prevCRPos >= 0) {
                                    const afterCRTrim = afterCR.replace(
                                        /^ - /,
                                        '',
                                    )
                                    beforeSel = beforeCR + afterCRTrim
                                    opt.pos -=
                                        afterCR.length - afterCRTrim.length
                                }
                                return beforeSel + afterSel
                            },
                            filterSelection: (v) =>
                                v
                                    .replace(/^ 1. /g, '')
                                    .replace(/\n \d+. /g, '\n'),
                        })
                    }
                } else {
                    this.insert('\n 1. ', '\n')
                }
            } else {
                this.insert('\n 1. ', '\n', 'List Item', {
                    offsetStart: -10,
                    offsetEnd: 9,
                })
            }
        },
        ul() {
            if (this.hasSelection()) {
                // eslint-disable-next-line no-unused-vars
                const { sel, selPos, afterSel, prevCRPos, beforeCR, afterCR } =
                    this.selectionInfo()
                let beforeSel = this.selectionInfo()
                const partialSel = sel.indexOf('\n') === -1
                if (!partialSel) {
                    const indent = !sel.startsWith(' - ')
                    if (indent) {
                        this.insert('', '', ' - ', {
                            selectionAtEnd: true,
                            filterSelection: (v) =>
                                ' - ' +
                                v.replace(/\n$/, '').replace(/\n/g, '\n - ') +
                                '\n',
                        })
                    } else {
                        this.insert('', '', '', {
                            filterValue: (v, opt) => {
                                if (prevCRPos >= 0) {
                                    const afterCRTrim = afterCR.replace(
                                        /^ - /,
                                        '',
                                    )
                                    beforeSel = beforeCR + afterCRTrim
                                    opt.pos -=
                                        afterCR.length - afterCRTrim.length
                                }
                                return beforeSel + afterSel
                            },
                            filterSelection: (v) =>
                                v.replace(/^ - /g, '').replace(/\n - /g, '\n'),
                        })
                    }
                } else {
                    this.insert('\n - ', '\n')
                }
            } else {
                this.insert('\n - ', '\n', 'List Item', {
                    offsetStart: -10,
                    offsetEnd: 9,
                })
            }
        },
        heading() {
            const sel = this.selection(),
                partialSel = sel.indexOf('\n') === -1
            if (sel) {
                if (partialSel) {
                    this.insert('\n## ', '\n', '')
                } else {
                    this.insert('## ', '', '')
                }
            } else {
                this.insert('\n## ', '\n', 'Heading', {
                    offsetStart: -8,
                    offsetEnd: 7,
                })
            }
        },
        comment() {
            const { sel, selPos, afterSel, prevCRPos, beforeCR, afterCR } =
                this.selectionInfo()
            let beforeSel = this.selectionInfo()
            const comment = !sel.startsWith('//') && !afterCR.startsWith('//')
            if (comment) {
                if (!sel) {
                    this.replace({
                        value: beforeCR + '//' + afterCR + afterSel,
                        selectionStart: selPos + '//'.length,
                    })
                } else {
                    this.insert('', '', '//', {
                        selectionAtEnd: true,
                        filterSelection: (v) =>
                            '//' +
                            v.replace(/\n$/, '').replace(/\n/g, '\n//') +
                            '\n',
                    })
                }
            } else {
                this.insert('', '', '', {
                    filterValue: (v, opt) => {
                        if (prevCRPos >= 0) {
                            const afterCRTrim = afterCR.replace(/^\/\//, '')
                            beforeSel = beforeCR + afterCRTrim
                            opt.pos -= afterCR.length - afterCRTrim.length
                        }
                        return beforeSel + afterSel
                    },
                    filterSelection: (v) =>
                        v.replace(/^\/\//g, '').replace(/\n\/\//g, '\n'),
                })
            }
        },
        blockComment() {
            this.insert('/*\n', '*/\n', '')
        },
        undoAction() {
            if (this.history.length === 0) return false
            const $txt = this.input()
            const lastState = this.history.pop()
            this.redo.push({
                value: $txt.value,
                selectionStart: $txt.selectionStart,
                selectionEnd: $txt.selectionEnd,
            })
            this.replace(lastState)
            return true
        },
        redoAction() {
            if (this.redo.length === 0) return false
            const $txt = this.input()
            const lastState = this.redo.pop()
            this.history.push({
                value: $txt.value,
                selectionStart: $txt.selectionStart,
                selectionEnd: $txt.selectionEnd,
            })
            this.replace(lastState)
            return true
        },
    },
    mounted() {
        // Set initial value
        this.$emit('input', this.defaultValue)

        // Setup required vars
        ;(this.history = []), (this.redo = [])
        const $txt = this.$refs.txt.$refs.input

        $txt.onkeydown = (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                this.$emit('close')
                return
            }

            const c = String.fromCharCode(e.keyCode).toLowerCase()
            if (c === '\t') {
                //tab: indent/unindent
                const indent = !e.shiftKey
                if (indent) {
                    this.insert('', '', '    ', {
                        selectionAtEnd: true,
                        filterSelection: (v) =>
                            '    ' +
                            v.replace(/\n$/, '').replace(/\n/g, '\n    ') +
                            '\n',
                    })
                } else {
                    this.insert('', '', '', {
                        filterValue: (v, opt) => {
                            const {
                                // eslint-disable-next-line no-unused-vars
                                selPos,
                                afterSel,
                                prevCRPos,
                                beforeCR,
                                afterCR,
                            } = this.selectionInfo()
                            let beforeSel = this.selectionInfo()
                            if (prevCRPos >= 0) {
                                const afterCRTrim = afterCR
                                    .replace(/\t/g, '    ')
                                    .replace(/^ ? ? ? ?/, '')
                                beforeSel = beforeCR + afterCRTrim
                                opt.pos -= afterCR.length - afterCRTrim.length
                            }
                            return beforeSel + afterSel
                        },
                        filterSelection: (v) =>
                            v
                                .replace(/\t/g, '    ')
                                .replace(/^ ? ? ? ?/g, '')
                                .replace(/\n {4}/g, '\n'),
                    })
                }
                e.preventDefault()
            } else if (e.ctrlKey) {
                if (c === 'z') {
                    //z: undo/redo
                    if (!e.shiftKey) {
                        if (this.undoAction()) {
                            e.preventDefault()
                        }
                    } else {
                        if (this.redoAction()) {
                            e.preventDefault()
                        }
                    }
                } else if (c === 'b' && !e.shiftKey) {
                    //b: bold
                    this.bold()
                    e.preventDefault()
                } else if (c === 'h' && !e.shiftKey) {
                    //h: heading
                    this.heading()
                    e.preventDefault()
                } else if (c === 'i' && !e.shiftKey) {
                    //i: italic
                    this.italic()
                    e.preventDefault()
                } else if (c === 'q' && !e.shiftKey) {
                    //q: blockquote
                    this.quote()
                    e.preventDefault()
                } else if (c === 'l') {
                    //l: link/image
                    if (!e.shiftKey) {
                        this.link()
                        e.preventDefault()
                    } else {
                        this.image()
                        e.preventDefault()
                    }
                } else if (
                    c === ',' ||
                    e.key === '<' ||
                    e.key === '>' ||
                    e.keyCode === 188
                ) {
                    //<>: code
                    this.code(e)
                    e.preventDefault()
                } else if (c === '/' || e.key === '/') {
                    this.comment()
                    e.preventDefault()
                } else if ((c === '?' || e.key === '?') && e.shiftKey) {
                    this.blockComment()
                    e.preventDefault()
                } else if (c === 'm') {
                    //e: LaTeX
                    this.latex(e)
                    e.preventDefault()
                }
            } else if (e.altKey) {
                if (e.key === '1' || e.key === '0') {
                    this.ol()
                    e.preventDefault()
                } else if (e.key === '-') {
                    this.ul()
                    e.preventDefault()
                } else if (e.key === 's') {
                    this.strikethrough()
                    e.preventDefault()
                }
            }
        }
    },
}
</script>
