<template>
    <div @click="setMash">
        <div id="searchBox" class="searchForm" :class="maskShow ? 'focus_hi' : '' ">
            <div class="logo">
                <a href="/">
                    <img src="~@/assets/images/logo.png" width="80" height="80" />
                </a>
            </div>
            <div id="est_switch">
                <div
                    v-for="(seo,index) in seoList"
                    v-bind:key="index"
                    class="est"
                    :class="tabIndex == index ? 'est_selected' : 'est_unselected'"
                    @click="changeTab(index,seo)"
                >
                    <img width="16" height="16" :src="seo.icon" />
                    <span style="margin-left:10px;padding:2.4px">{{ seo.text }}</span>
                </div>
            </div>
            <div id="searchControl" class="searchControls">
                <form
                    id="searchForm"
                    :action="searchValue ? currentAction : '' "
                    :target="searchValue ? '_blank' : '_self'"
                >
                    <div class="searchBoxForm">
                        <input
                            id="searchInput"
                            title="输入搜索词"
                            maxlength="100"
                            autocomplete="off"
                            spellcheck="false"
                            :name="searchName"
                            v-model="searchValue"
                            class="searchInput"
                            @keyup="changeContent"
                            @keyup.up="handelUp"
                            @keyup.down="handelDown"
                            @keyup.enter="handelEnter"
                        />
                        <div id="searchGoBox">
                            <input class="searchBoxSubmit" id="searchGo" />
                        </div>
                    </div>
                    <div class="search-as" :class="searchValue  ? '' : 'hide'">
                        <ul id="sa_ul">
                            <li
                                :class="index == searchResultIndex ? 'selected' : ''"
                                @click="handelSubmit(res)"
                                @mouseenter="searchResultIndex = index"
                                v-bind:key="index"
                                v-for="(res,index) in searchResults"
                            >
                                <div class="sa_tm">
                                    <img width="16" height="16" :src="currentSeo.icon" />
                                    <span class="sa_tm_text">{{ res.text}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
        <div
            v-show="maskShow"
            id="focus_ovr"
            style="visibility: visible;opacity: 0.55;"
            data-bm="20"
        ></div>
    </div>
</template>
<script>
import axios from "axios";
axios.jsonp = (url, data) => {
    var code;
    var callback_str;
    if (typeof data === "object") {
        code = data.code;
    }
    if (!url) throw new Error("url is necessary");
    var callback = `window.${code}.sug`;
    const JSONP = document.createElement("script");
    JSONP.setAttribute("type", "text/javascript");

    const headEle = document.getElementsByTagName("head")[0];

    let ret = "";
    if (data) {
        if (typeof data === "string") ret = "&" + data;
        else if (typeof data === "object") {
            for (let key in data)
                ret += "&" + key + "=" + encodeURIComponent(data[key]);
        }
        ret += "&_time=" + Date.now();
    }
    //定义回调函数
    if (code == "bing") {
        callback_str = "&cb=";
    } else {
        callback_str = "&callback=";
    }

    JSONP.src = `${url}${callback_str}${callback}${ret}`;
    return new Promise((resolve, reject) => {
        window[code] = {
            sug: function(json) {
                resolve(json);
            }
        };

        headEle.appendChild(JSONP);
    });
};
export default {
    data() {
        return {
            maskShow: false,
            searchValue: null,
            searchResults: [],
            tabIndex: 0,
            tabCode: "bing",
            searchName: "q",
            searchResultIndex: -1,
            currentAction: "https://www.bing.com/search",
            seoList: [
                {
                    text: "必应",
                    code: "bing",
                    queryName: "q",
                    action: "https://www.bing.com/search",
                    icon: require("@/assets/favicons/bing.png")
                },
                {
                    text: "谷歌",
                    code: "google",
                    queryName: "q",
                    action: "https://www.google.com/search",
                    icon: require("@/assets/favicons/google.png")
                },
                {
                    text: "百度",
                    code: "baidu",
                    queryName: "wd",
                    action: "https://www.baidu.com/s",
                    icon: require("@/assets/favicons/baidu.png")
                },
                {
                    text: "好搜",
                    code: "so",
                    queryName: "q",
                    action: "https://www.so.com/s",
                    icon: require("@/assets/favicons/so.png")
                },
                {
                    text: "搜狗",
                    code: "sogou",
                    queryName: "query",
                    action: "https://www.sogou.com/web",
                    icon: require("@/assets/favicons/sogou.png")
                },
                {
                    text: "淘宝",
                    code: "taobao",
                    queryName: "q",
                    action: "https://s.taobao.com/search",
                    icon: require("@/assets/favicons/taobao.png")
                }
            ],
            currentSeo: {
                text: "必应",
                code: "bing",
                icon: require("@/assets/favicons/bing.png")
            }
        };
    },
    computed: {
        searchUrl() {
            var url;
            switch (this.tabCode) {
                case "bing":
                    url = `https://api.bing.com/qsonhs.aspx?type=cb&q=${this.searchValue}`;
                    break;
                case "google":
                    url = `http://suggestqueries.google.com/complete/search?client=youtube&q=${this.searchValue}`;
                    break;
                case "baidu":
                    url = `https://suggestion.baidu.com/su?format=json&wd=${this.searchValue}`;
                    break;
                case "so":
                    url = `https://sug.so.360.cn/suggest?encodein=utf-8&encodeout=utf-8&word=${this.searchValue}`;
                    break;
                case "sogou":
                    url = `https://www.sogou.com/suggnew/ajajjson?type=web&key=${this.searchValue}`;
                    break;
                case "taobao":
                    url = `https://suggest.taobao.com/sug?code=utf-8&q=${this.searchValue}`;
                    break;
                default:
                    url = `https://api.bing.com/qsonhs.aspx?type=cb&q=${this.searchValue}`;
            }
            return url;
        }
    },
    methods: {
        setMash() {
            let dom = document.getElementById("searchInput");
            if (dom) {
                if (!dom.contains(event.target)) {
                    //这句是说如果我们点击到了id为child以外的区域
                    this.maskShow = false;
                } else {
                    this.maskShow = true;
                }
            }
        },
        changeTab(index, seo) {
            this.tabIndex = index;
            this.tabCode = seo.code;
            this.searchResults = [];
            this.searchValue = null;
            this.currentSeo = seo;
            this.searchName = seo.queryName;
            this.currentAction = seo.action;
        },
        handelSubmit(res) {
            let dom = document.getElementById("searchForm");
            this.searchValue = res.text;
            document.getElementById("searchInput").value = res.text;
            if (dom) {
                dom.submit();
            }
        },
        changeContent() {
            if (!this.searchValue) return;
            axios
                .jsonp(this.searchUrl, { code: this.tabCode })
                .then(res => {
                    this.parseData(res);
                })
                .catch(err => console.log(err))
                .finally(function() {
                    // always executed
                });
        },
        handelUp() {
            if (this.searchResultIndex == 0) {
                return;
            }
            this.searchResultIndex--;
            console.log("向上 index:" + this.searchResultIndex);
        },
        handelDown() {
            if (this.searchResultIndex == this.searchResults.length - 1) {
                return;
            }
            this.searchResultIndex++;
            console.log("向下 index:" + this.searchResultIndex);
        },
        handelEnter() {
            if (
                this.searchResultIndex == -1 ||
                this.searchResultIndex == this.searchResults.length - 1
            ) {
                return;
            }
            this.handelSubmit(this.searchResults[this.searchResultIndex]);
        },
        //解析接口返回数据
        parseData(response) {
            switch (this.tabCode) {
                case "bing":
                    this.parseBing(response);
                    break;
                case "google":
                    this.parseGoogle(response);
                    break;
                case "baidu":
                    this.parseBaidu(response);
                    break;
                case "so":
                    this.parseSo(response);
                    break;
                case "sogou":
                    this.parseSogou(response);
                    break;
                case "taobao":
                    this.parseTaobao(response);
                    break;
                default:
                    this.parseBing(response);
            }
        },

        // bing   必应
        parseBing(response) {
            if (response.AS.FullResults > 0) {
                this.searchResults = response.AS.Results[0].Suggests.map(r => {
                    return { text: r.Txt };
                });
            }
        },
        // google 谷歌
        parseGoogle(response) {
            response.shift(); // 去掉第一个数据及用户搜索文本
            this.searchResults = response[0].map(arr => {
                return { text: arr[0] };
            });
        },
        // baidu  百度
        parseBaidu(response) {
            var results = response.s;
            this.searchResults = results.map(text => {
                return { text: text };
            });
        },
        // so     好搜
        parseSo(response) {
            this.searchResults = response.s.map(res => {
                return { text: res };
            });
        },
        /// sogou 搜狗
        parseSogou(response) {
            response.shift();
            this.searchResults = response[0].map(text => {
                return { text: text };
            });
        },
        parseTaobao(response) {
            this.searchResults = response.result.map(arr => {
                return { text: arr[0] };
            });
        }
        // taoabo 淘宝
    }
};
</script>
<style scoped>
#est_switch {
    position: absolute;
    margin-top: -36px;
    margin-left: 103px;
    z-index: 2;
    background-color: #ffffff;
}
#est_switch .est_selected {
    cursor: auto;
    z-index: 1;
    border: 2px solid #dddddd;
    border-top: 2px solid red;
}
#est_switch .est_unselected {
    border-bottom: 2px solid #dddddd !important;
    color: #010101;
    cursor: auto;
    z-index: 1;
}

.est {
    position: relative;
    display: inline-block;
    height: 26px;
    line-height: 26px;
    font-size: 16px;
    text-align: center;
    padding: 5px 17px;
    color: #464646;
    font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif;
    cursor: pointer !important;
}
div#searchBox.searchForm {
    left: 88px;
}
.searchForm {
    position: absolute;
    top: 20%;
    left: 8%;
    margin: 0;
    z-index: 9;
}
#searchBox .logo {
    float: left;
    position: relative;
    top: -38px;
    margin-right: 21px;
}
.searchControls {
    display: inline-block;
}
.searchControls .searchBoxForm {
    border-radius: 6px;
    line-height: 42px;
    background-color: #fff;
    border: 1px #ccc solid;
    padding: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    position: relative;
    display: inline-block;
}
.searchBoxForm .searchInput {
    background-color: #fff;
    margin: 6px 1px 0 10px;
    margin-top: 8px;
    border-right: 0;
    padding-right: 4px;
    width: 540px;
    margin: 2px 0 3px 12px;
    border: 0;
    padding: 0 10px 0 0;
    max-height: 30px;
    outline: none;
    -webkit-appearance: none;
    border-right: 1px solid;
    border-color: #ccc;
    box-sizing: content-box;
    position: relative;
    height: 40px;
    font-size: 16px;
}
#searchGoBox {
    display: inline;
}
#searchGoBox .searchBoxSubmit {
    text-align: center;
    cursor: default;
    color: buttontext;
    background-color: buttonface;
    box-sizing: border-box;
    padding: 1px 7px 2px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(216, 216, 216) rgb(209, 209, 209) rgb(186, 186, 186);
    border-image: initial;
    height: 49px;
    width: 49px;
    border-width: 10px;
    height: 45px;
    width: 45px;
    border: 8px solid transparent;
    background: transparent url("~@/assets/images/icons.png") no-repeat;
    background-position: -169px -63px;
    overflow: hidden;
    vertical-align: top;
    text-indent: -99em;
    position: static;
    right: 0;
    top: 0;
    outline: none;
    cursor: pointer;
}

div#focus_ovr {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    width: 100%;
    background: #000;
    z-index: 300;
    opacity: 0;
}
.focus_hi {
    z-index: 301 !important;
}

/* 搜索内容*/
.search-as {
    display: block;
    background-color: transparent;
    border: none;
    position: absolute;
    width: 100%;
}

.search-as:not(.sa_nw) #sa_ul:not(:empty) {
    background-color: #fff;
    border: 1px solid #e5e5e5;
    width: 571px;
    margin-top: -4px;
}
#sa_ul:not(:empty) {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
}
#searchBox .search-as #sa_ul {
    box-shadow: none;
}
.search-as.hide {
    display: none;
}
.search-as #sa_ul li,
#sw_as .nowrap {
    white-space: nowrap;
}
.search-as .sa_drw .sa_sg {
    cursor: pointer;
}
.search-as #sa_ul li {
    border: 0;
    border-collapse: collapse;
    border-spacing: 0;
    list-style: none;
    margin: 0;
    margin-left: -40px;
    padding: 0;
}

.search-as #sa_ul li.selected {
    background: #ececec;
    cursor: pointer;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
}
.search-as .sa_tm {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin: 0 10px;
    line-height: 36px;
}
</style>