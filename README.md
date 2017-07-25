# WeChatMPViewer
微信公众号查看器

nodejs+express+angularjs+mongodb 练手项目

功能：
1、将关注的公众号发表的文章集中显示
2、公众号管理：添加关注的公众号

业务逻辑和难点：
1、爬取公众号文章：爬取搜狗微信的公众号和文章
2、爬取过多会要求输入验证码（待解决）
3、公众号和文章连接会超时（待解决）
4、图片外链：html中加入标签 <meta name="referrer" content="never"> 可以解决图片不能外链的问题
5、