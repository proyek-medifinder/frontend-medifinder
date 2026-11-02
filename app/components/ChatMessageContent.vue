<template>
    <div class="chat-markdown" v-html="formattedText"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderChatMarkdown } from '@/utils/chatMarkdown'

const props = defineProps<{ text: string }>()
const formattedText = computed(() => renderChatMarkdown(props.text))
</script>

<style scoped>
.chat-markdown {
    min-width: 0;
    line-height: 1.75;
    overflow-wrap: anywhere;
}

.chat-markdown :deep(p),
.chat-markdown :deep(ul),
.chat-markdown :deep(ol),
.chat-markdown :deep(blockquote),
.chat-markdown :deep(pre),
.chat-markdown :deep(.chat-table-scroll) {
    margin: 0.75rem 0;
}

.chat-markdown :deep(h1),
.chat-markdown :deep(h2),
.chat-markdown :deep(h3),
.chat-markdown :deep(h4),
.chat-markdown :deep(h5),
.chat-markdown :deep(h6) {
    margin: 1rem 0 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.5;
}

.chat-markdown :deep(strong) { font-weight: 700; }
.chat-markdown :deep(em) { font-style: italic; }
.chat-markdown :deep(ul) { list-style: disc; padding-left: 1.25rem; }
.chat-markdown :deep(ol) { list-style: decimal; padding-left: 1.5rem; }
.chat-markdown :deep(li) { margin: 0.35rem 0; padding-left: 0.15rem; }
.chat-markdown :deep(li > p) { margin: 0.35rem 0; }
.chat-markdown :deep(li > ul),
.chat-markdown :deep(li > ol) { margin: 0.35rem 0; }
.chat-markdown :deep(a) { color: #0d9488; text-decoration: underline; text-underline-offset: 3px; }
.chat-markdown :deep(a:focus-visible) { outline: 2px solid currentColor; outline-offset: 3px; }
.chat-markdown :deep(blockquote) { border-left: 3px solid #14b8a6; padding-left: 0.75rem; }
.chat-markdown :deep(code) { border-radius: 0.3rem; background: rgb(127 127 127 / 14%); padding: 0.1rem 0.3rem; font-size: 0.85em; }
.chat-markdown :deep(pre) { overflow-x: auto; border-radius: 0.75rem; background: rgb(127 127 127 / 12%); padding: 0.75rem; }
.chat-markdown :deep(pre code) { background: none; padding: 0; white-space: pre; }
.chat-markdown :deep(hr) { margin: 1rem 0; border: 0; border-top: 1px solid rgb(127 127 127 / 25%); }
.chat-markdown :deep(.chat-table-scroll) { overflow-x: auto; }
.chat-markdown :deep(table) { width: 100%; border-collapse: collapse; font-size: 0.85em; }
.chat-markdown :deep(th),
.chat-markdown :deep(td) { border: 1px solid rgb(127 127 127 / 30%); padding: 0.4rem 0.6rem; text-align: left; }
.chat-markdown :deep(th) { background: rgb(127 127 127 / 12%); font-weight: 700; }
.chat-markdown :deep(> :first-child) { margin-top: 0; }
.chat-markdown :deep(> :last-child) { margin-bottom: 0; }
</style>
