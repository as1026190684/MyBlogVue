<template>
  <div class="block" >
    <span class="demonstration">
      <clock-item
        v-for="(item,index)  in currentPageDataArr"
        :key="index"
        :oneClockInData="item">
      </clock-item>
    </span>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total="allClockInDataArr.length"
      style="margin-left:auto;margin-right:auto;text-align: center">
    </el-pagination>
  </div>
</template>

<script>
import ClockItem from "@/components/clockIn/ClockInItem";

export default {
  name: "Pagination",
  components: {
    ClockItem,
  },
  props: {
    allClockInDataArr:Array  //所有数据
  },
  data() {
    return {
      records: 1,
      currentPageDataArr: [],//当前页显示内容
      totalPage: 1, // 统共页数，默认为1
      currentPage: 1, //当前页数 ，默认为1
      pageSize: 10, // 每页显示数量
    };
  },
  computed: {

  },
  created() {
    this.setCurrentPageData();
  },
  mounted() {

  },
  methods: {
    setCurrentPageData() {
      let begin = (this.currentPage - 1) * this.pageSize;
      let end = this.currentPage * this.pageSize;
      this.currentPageDataArr = this.allClockInDataArr.slice(
        begin,
        end
      );
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.setCurrentPageData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.setCurrentPageData()
    },

  }
}
</script>

<style scoped>

</style>
