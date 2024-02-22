<template>
  <div>
    <tiptap-vuetify v-model="content" :extensions="extensions" />
  </div>
</template>

<script>
// import the component and the necessary extensions
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from 'tiptap-vuetify'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  components: { TiptapVuetify },
  data() {
    return {
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [
          Heading,
          {
            options: {
              levels: [1, 2, 3, 4, 5],
            },
          },
        ],
        Bold,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak,
      ],
      // starting editor's content
      content: this.value,
    }
  },
  watch: {
    value(v) {
      this.content = v
    },
    content(value) {
      this.$emit('input', value)
    },
  },
}
</script>
