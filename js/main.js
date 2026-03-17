const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
        };
    },
    created() {
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
        this.render();
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            this.scrollTop = newScrollTop;
        },
    },
});
app.mount("#layout");

mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.render();
    
    // 专门处理代码块的滚动
    this.fixCodeScroll();
},
methods: {
    fixCodeScroll() {
        // 修复所有代码块的滚动事件
        document.querySelectorAll('pre, .code-content').forEach(pre => {
            pre.addEventListener('wheel', (e) => {
                // 如果代码块有横向滚动空间，优先横向滚动
                if (pre.scrollWidth > pre.clientWidth && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                    pre.scrollLeft += e.deltaY * 2; // 加大滚动速度
                    e.preventDefault();
                }
            }, { passive: false });
            
            // 触摸设备支持
            pre.addEventListener('touchstart', (e) => {
                this.startX = e.touches[0].clientX;
                this.startY = e.touches[0].clientY;
                this.scrollLeft = pre.scrollLeft;
                this.scrollTop = pre.scrollTop;
            }, { passive: true });
            
            pre.addEventListener('touchmove', (e) => {
                if (pre.scrollWidth > pre.clientWidth) {
                    const x = e.touches[0].clientX;
                    const moveX = this.startX - x;
                    pre.scrollLeft = this.scrollLeft + moveX;
                    e.preventDefault();
                }
            }, { passive: false });
        });
    },
}