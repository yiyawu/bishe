<template>
    <div class="wrap" id="app-footer">
        <div class="link-top"></div>
        <p id="foot"> 使用条款和隐私条款。版权所有，保留一切权利。
        <a href="http://www.beian.miit.gov.cn">闽ICP备19020415号-1</a>
        </p>
    </div>
</template>
 
<script>
    export default {
        name: 'app-footer',
        data () {
            return {
            }
        }
    }
</script>

<style>
.wrap {
    text-align: center;
    
    position:absolute;
    right:0;
    bottom:0;
    left:0;
}
#app-footer{flex: 0;}
#foot{
 color: white;
}
.link-top{
    width: 100%;
    height: 1px;
    border-top: solid #ACC0D8 1px;
}
</style>