<template>
  <mavon-editor
    class="me-editor"
    ref="md"
    v-model="editor.value"
    @imgAdd="imgAdd"
    :codeStyle="codeStyle"
    :ishljs="true"
    v-bind="editor">
  </mavon-editor>
</template>


<script>

  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'

  import {upload} from '@/api/upload'

  export default {
    name: 'MarkdownEditor',
    props: {
      editor: Object
    },
    data() {
      return {
        task: '',
        codeStyle:'monokai-sublime',//主题   mavon-editor.js自带的主题样式，不需要再次引入highlight.js
      }
    },
    mounted() {
      this.$set(this.editor, 'ref', this.$refs.md)
    },
    methods: {
      imgAdd(pos, $file) {
        let that = this
        let formdata = new FormData();
        formdata.append('file', $file);

        upload(formdata).then(data => {
          // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
          if (data.success) {

            that.$refs.md.$img2Url(pos, data.data);
          } else {
            that.$message({message: data.msg, type: 'error', showClose: true})
          }

        }).catch(err => {
          that.$message({message: err, type: 'error', showClose: true});
        })
      }
    },
    components: {
      mavonEditor
    }
  }
</script>
<style scoped>

  .me-editor {
    z-index: 6 !important;
  }

  .v-note-wrapper.fullscreen {
    top: 60px !important
  }
</style>
