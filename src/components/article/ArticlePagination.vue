<template>
  <div class="block" >
    <span class="demonstration">
     <article-item
       v-for="a in articles"
       :key="a.id"
       v-bind="a"></article-item>
    </span>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="innerPage.pageNumber"
      :page-size="innerPage.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total="total"
      style="margin-left:auto;margin-right:auto;text-align: center">
    </el-pagination>
  </div>
</template>

<script>
import {getArticles} from "@/api/article";
import ArticleItem from "@/components/article/ArticleItem";

export default {
  name: "ArticlePagination",
  components: {
    'article-item': ArticleItem,
  },
  props: {
    allClockInDataArr: Array,  //所有数据
    blogArticles: Array,
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
  data() {
    return {
      records: 1,
      currentPageDataArr: [],//当前页显示内容
      totalPage: 1, // 统共页数，默认为1
      total: 0,  //总记录数
      // currentPage: 1, //当前页数 ，默认为1
      // pageSize: 10, // 每页显示数量
      loading: false,
      noData: false,
      innerPage: {
        pageSize: 10,
        pageNumber: 1,
        name: 'a.createDate',
        sort: 'desc'
      },
      articles: []
    };
  },
  watch: {
    'query': {
    handler() {
      this.noData = false
      this.articles = []
      this.innerPage.pageNumber = 1
      this.getArticles()
    },
    deep: true
    },
    'page': {
      handler() {
        this.noData = false
        this.articles = []
        this.innerPage = this.page
        this.getArticles()
      },
     deep: true
    }
  },
  computed: {

  },
  created() {
    this.getArticles();
  },
  mounted() {
    // console.log("pageAllClockIn:" + this.allClockInDataArr);

  },
  methods: {

    getArticles() {
      let that = this
      that.loading = true
      getArticles(that.query, that.innerPage).then(data => {

        let newArticles = data.data.records
        if (newArticles && newArticles.length > 0) {
          that.articles = newArticles
          that.total=data.data.total
          console.log(that.articles);
        } else {
          that.noData = true
        }

      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: '文章加载失败!', showClose: true})
        }
      }).finally(() => {
        that.loading = false
      })
    },

    // setCurrentPageData() {
    //   let begin = (this.currentPage - 1) * this.pageSize;
    //   let end = this.currentPage * this.pageSize;
    //    // console.log("pageAllClockInDataArr:" + this.allClockInDataArr);
    //   this.currentPageDataArr = this.allClockInDataArr.slice(
    //     begin,
    //     end
    //   );
    // console.log("pageCurrentPage:" + this.currentPageDataArr);
    // },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.innerPage.pageSize = val;
      this.getArticles()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.innerPage.pageNumber = val;
      this.getArticles()
    },
  }
}
</script>

<style scoped>

</style>
