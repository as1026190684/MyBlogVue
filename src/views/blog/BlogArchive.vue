<template>
  <div v-title :data-title="title">
    <el-container style="width: 1000px;">

      <el-aside class="me-area">
        <ul class="me-month-list">
          <li v-for="a in archives" :key="a.year + a.month" class="me-month-item">
            <el-badge :value="a.count">
              <el-button @click="changeArchive(a.year, a.month)" size="small" type="button"
                         :class="disabled.year===a.year && disabled.month===a.month? 'click-disable':''"><!--阻止文章归档年月多次点击-->
                {{a.year +'年' + a.month + '月'}}
              </el-button>
            </el-badge>
          </li>
        </ul>
      </el-aside>

      <el-main class="me-articles">
        <div class="me-month-title">{{currentArchive}}</div>
<!--        <article-scroll-page v-bind="article"></article-scroll-page>-->
        <article-pagination v-bind="article"></article-pagination>
      </el-main>
    </el-container>
  </div>

</template>

<script>
  import ArticleScrollPage from '@/views/common/ArticleScrollPage'
  import {getArticles, listArchives} from '@/api/article'
  import ArticlePagination from "@/components/article/ArticlePagination";

  export default {
    name: "BlogArchive",
    components: {
      ArticleScrollPage,
      'ArticlePagination': ArticlePagination
    },
    created() {
      this.listArchives()
    },
    props: {
      offset: {
        type: Number,
        default: 100
      },
      page: {
        type: Object,
        default() {
          return {}
        }
      },
      query: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      '$route'() {
        if (this.$route.params.year && this.$route.params.month) {
          this.article.query.year = this.$route.params.year
          this.article.query.month = this.$route.params.month
        }
      }
    },
      data() {
        return {
          article: {
            query: {
              month: this.$route.params.month,
              year: this.$route.params.year
            }
          },
          archives: [],
          disabled: {//阻止文章归档年月多次点击
            year: '',
            month:''
          }

        }
      },
      computed: {
        title() {
          return this.currentArchive + ' - 文章归档 '
        },
        currentArchive() {
          if (this.article.query.year && this.article.query.month) {
            return `${this.article.query.year}年${this.article.query.month}月`
          }
          return '全部'
        },

      },
      methods: {
        changeArchive(year, month) {
          // this.currentArchive = `${year}年${month}月`
          // this.article.query.year = year
          // this.article.query.month = month
          this.$router.push({path: `/archives/${year}/${month}`})
          //阻止文章归档年月多次点击
          this.disabled.year =year
          this.disabled.month =month
        },

        listArchives() {
          listArchives().then((data => {
            this.archives = data.data
          })).catch(error => {
            this.$message({type: 'error', message: '文章归档加载失败!', showClose: true})
          })
        }
      }

  }
</script>

<style scoped>

  .el-container {
    width: 640px;
    min-width: 700px;
  }

  .el-aside {
    /*height: auto;*/
    position: relative;
    margin-right: 20px;
    width: 150px !important;
  }

  .el-main {
    padding: 0px;
    line-height: 16px;
  }

  .me-month-list {
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    list-style-type: none;
  }

  .me-month-item {
    margin-top: 18px;
    padding: 4px;
    font-size: 18px;
    color: #5FB878;
  }

  .me-order-list {
    float: right;
  }

  .me-month-title {
    margin-left: 4px;
    margin-bottom: 12px;
  }
  .click-disable{
    pointer-events: none;
  }

</style>
