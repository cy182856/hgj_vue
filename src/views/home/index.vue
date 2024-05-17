<template>
    <div style="margin-left: 20px;">     
        <!-- <h4>欢迎使用智慧管家</h4>
        <markdown-it-vue class="md-body" :content="htmlMD" />    -->
        <div v-html="htmlContent"></div>
    </div>
</template>

  <script>
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  // import MarkdownItVue from "markdown-it-vue";
  // import "markdown-it-vue/dist/markdown-it-vue.css";

  import axios from 'axios';
  
  export default {
    name: 'ComplexTable',
    components: { Pagination },
    // components: { MarkdownItVue},  
    directives: { waves },
    
    data() {
      return {
        // htmlMD: "" 
        htmlContent: ''
      }
    },
    created() {
     // this.loadMarkdown()
     this.loadHtml();
    },
    methods: {
        // loadMarkdown() {
        //     // 假设您有一个本地markdown文件路径
        //     const markdownPath = './md.md'
        //     //通过fetch请求将.md文件转化为markdown-it-vue可以解析的字符串
        //     fetch(markdownPath)
        //         .then(response => response.text())
        //         .then(markdown => {          
        //             this.htmlMD = markdown
        //         }).catch(error => {
        //                 console.error('Error loading markdown:', error);
        //             });
        // }    
        loadHtml() {
          axios.get('./home.html')
            .then(response => {
              this.htmlContent = response.data;
            })
            .catch(error => {
              console.error('Error loading HTML:', error);
            });
        }
    }
}
  </script>



  
  
  