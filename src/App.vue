<template>
    <div id="app" style="background-color: #333; ">
        <div
            :style="{backgroundImage: 'url('+('https://www.bing.com/'+this.imgUrls[this.imageNum])+')',opacity: opacity,transition:  'opacity 500ms', height: '100%'}"
        >
            <div class="header">
                <ul id="header-link">
                    <li v-bind:key="index" v-for="(link,index) in headerLinkList">
                        <a v-if="link.url" :href="link.url" target="_blank">{{ link.name }}</a>
                        <a v-else>{{ link.name }}</a>
                    </li>
                </ul>
            </div>
            <router-view />
            <div class="bottomCell">
                <div class="imgControls">
                    <div class="imgButtons">
                        <a
                            title="上一个图像"
                            class="leftButton"
                            :class="disabled || (imageNum == 0) ? 'disabled' : '' "
                            @click="handelPrev"
                        >
                            <div class="prevImg"></div>
                        </a>
                        <a
                            title="下一个图像"
                            class="rightButton"
                            :class="disabled || (imageNum == 7 )? 'disabled' : '' "
                            @click="handelNext"
                        >
                            <div class="nextImg"></div>
                        </a>
                    </div>
                </div>
                <footer id="footer">
                    <div class="footerItems">
                        <ul style="float:left;">
                            <li>                            
                                <a  href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32068202000225" target="_blank">                              
                                    <span>
                                        <img src="~@/assets/favicons/filling.png" style="margin-top:-5px;">  
                                       <span style="margin-left:10px"> 苏公网安备 32068202000225号</span>
                                   </span>
                                </a> 
                                 <a href="http://www.beian.gov.cn/" target="_blank"><span>苏ICP备19075026号-1</span></a>
                            </li>
                        </ul>
                        <ul style="float:right;">
                            <li>
                                <span>© 2019 www.fire-kirin.club All rights reserved.</span>
                            </li>
                        </ul>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "App",
    data() {
        return {
            headerLinkList: [
                { name: "图片", url: "" },
                { name: "视频", url: "" },
                { name: "文档", url: "http://doc.fire-kirin.club" },
                { name: "词典", url: "" },
                { name: "地图", url: "" },
                { name: "|", url: "" },
                { name: "Fire-Kirin-Doc", url: "http://doc.fire-kirin.club" }
            ],
            opacity: 1,
            disabled: false,
            imageNum: 0,
            imgUrls: [
                "/th?id=OHR.LandwasserViaduct_ZH-CN7692075960_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp"
            ]
        };
    },
    mounted() {
        if (this._isMobile()) {
            alert(
                "检测到当前访问设备为移动端，影响体验效果，为了更好体验建议您更换至PC端操作"
            );
        }
        this.getBgImg();
    },

    methods: {
        _isMobile() {
            let flag = navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            );
            return flag;
        },
        // 上一张
        handelPrev() {
            if (this.disabled || this.imageNum == 0) return;
            this.opacity = 0;
            this.disabled = true;
            setTimeout(() => {
                this.imageNum--;
                this.opacity = 1;
                this.disabled = false;
            }, 500);
        },
        // 下一张
        handelNext() {
            if (this.disabled || this.imageNum == 7) return;
            this.opacity = 0;
            this.disabled = true;
            setTimeout(() => {
                this.imageNum++;
                this.opacity = 1;
                this.disabled = false;
            }, 500);
        },
        getBgImg() {
            //发送get请求
            let that = this;
            axios
                .get("http://yl-test.wicp.vip:2000/get_bing_images")
                .then(function(response) {
                    var images = response.data.data.map(image => {
                        return image.url;
                    });
                    images.pop();
                    that.imgUrls = that.imgUrls.concat(images);
                })
                .catch(function(error) {
                    // handle error
                    console.log(error);
                })
                .finally(function() {
                    // always executed
                });
        }
    }
};
</script>

<style scoped >
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: 50%;
    position: relative;
}
div.header {
    padding: 0;
    width: 100%;
    height: 43px;
    margin: 0;
    font-size: 13px;
}
.header ul#header-link {
    float: left;
    margin-left: 70px;
    margin-top: 2px;
    padding-left: 0;
    z-index: 11;
    position: absolute;
    top: 0;
    height: 43px;
    bottom: 0;
    left: 0;
}
ul {
    list-style: none;
    padding: 0;
}
.footerItems ul {
    float: left;
}
.header ul#header-link li {
    float: left;
    padding: 9px;
    color: #ffffff;
}
.header ul#header-link li a {
    color: #ffffff;
    font-weight: 600;
    font-size: 14px;
    line-height: 35px;
    text-decoration: none;
}

div.bottomCell {
    position: absolute;
    bottom: 0;
    width: 100%;
}
div.bottomCell > #footer {
    margin-top: 10px;
}
#footer {
    overflow: hidden;
    background-color: #333;
    font-weight: 400;
    height: 35px;
    z-index: 11;
    width: 100%;
    border: 0;
    padding: 0;
}

div.footerItems {
    color: #666;
    font-weight: 400;
    margin: 0;
    padding: 0 20px 0 49px;
    white-space: nowrap;
    height: 35px;
    line-height: 10px;
    width: 100%;
    box-sizing: border-box;
}
div.footerItems span {
    float: right;
    margin-right: 24px;
    font-size: small;
    color: #aba8a8;
}

div.imgControls {
    height: 80px;
}
div.imgControls div.imgButtons {
    position: absolute;
    right: 50px;
    margin-top: 20px;
}

div .imgButtons a {
    display: inline-block;
    text-decoration: none;
    cursor: pointer;
    vertical-align: top;
}

div div.imgButtons a.leftButton div.prevImg {
    background: transparent url("../src/assets/images/buttons.png") no-repeat;
    background-position: 0 -84px;
    overflow: hidden;
    width: 40px;
    height: 40px;
    margin: 0 10px;
}
.disabled {
    opacity: 0.5;
    cursor: default !important;
}

div.imgButtons a.rightButton div.nextImg {
    background: transparent url("../src/assets/images/buttons.png") no-repeat;
    background-position: 0 -126px;
    overflow: hidden;
    width: 40px;
    height: 40px;
    margin: 0 10px;
}

/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
    transition: all 0.3s ease;
}
.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
    transform: translateX(10px);
    opacity: 0;
}
</style>
