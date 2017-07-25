# WeChatMPViewer
微信公众号查看器<br/>

nodejs+express+angularjs+mongodb 练手项目<br/>

功能：<br/>
1、文章列表<br/>
    &emsp;1）按时间倒叙显示文章<br/>
    &emsp;2）支持文章搜索<br/>
2、公众号管理：<br/>
    &emsp;1）关注/取消关注公众号<br/>
    &emsp;2）支持公众号搜索<br/>

业务逻辑和难点：
1、爬取公众号文章：爬取搜狗微信的公众号和文章<br/>
2、爬取过多会要求输入验证码（待解决）<br/>
3、公众号和文章连接会超时（待解决）<br/>
4、图片外链：html中加入标签 " &lt;meta name="referrer" content="never"&gt; " 可以解决图片不能外链的问题<br/>
5、