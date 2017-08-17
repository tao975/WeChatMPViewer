<h1><strong>微信公众号查看器</strong></h1>

<h2><strong>需求背景</strong></h2>

<p>&nbsp;&nbsp;&nbsp;&nbsp;平时看公众号的时候，觉得同类型的公众号有很多都是重复的文章，比如平时关注的几个技术类的公众号，发布的文章大多数都有重复的，想对看过的文章能够过滤掉不再重复显示，而且还能够对公众号进行分类管理，按照不同的类型浏览文章。最近刚好在学习NodeJS和MongoDB，所以用NodeJS和MongoDB写了一个查看公众号的程序，可以在一个页面集中浏览所有公众号的文章，同时对文章进行分类，还是大图显示哦，哈哈哈哈哈哈哈</p>

<h2><strong>程序展示</strong></h2>

<p><img alt="" src="https://static.oschina.net/uploads/img/201708/17163811_1RTD.gif" /></p>

<h2><strong>源代码</strong></h2>

<p><strong>github：</strong><a href="https://github.com/tao975/WeChatMPViewer" target="_blank">https://github.com/tao975/WeChatMPViewer</a></p>

<h2><strong>使用技术</strong></h2>

<ul>
	<li><a href="http://nodejs.cn/" target="_blank">Node.js</a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; // &nbsp;搭建web服务</li>
	<li><a href="http://www.expressjs.com.cn/" target="_blank">Express.js </a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;// &nbsp;基于Node.js的 web 开发框架</li>
	<li><a href="https://www.npmjs.com/package/express-session" target="_blank">express-session</a>&nbsp; &nbsp; &nbsp; // &nbsp;node实现 session&nbsp;</li>
	<li><a href="https://www.npmjs.com/package/node-schedule" target="_blank">node-schedule</a>&nbsp; &nbsp; &nbsp; &nbsp;// &nbsp;node实现定时任务</li>
	<li><a href="https://www.npmjs.com/package/cheerio" target="_blank">cheerio</a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;// &nbsp;node解析Html</li>
	<li><a href="https://angularjs.org/" target="_blank">Angularjs</a> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; // &nbsp;前端JS MVC框架</li>
	<li><a href="http://www.bootcdn.cn/touchjs/" target="_blank">touchjs </a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;// &nbsp;移动端手势类库</li>
	<li><a href="https://github.com/sroze/ngInfiniteScroll/" target="_blank">ng-infinite-scroll</a>&nbsp; &nbsp;// &nbsp;angularjs 滚动加载控件</li>
	<li><a href="http://momentjs.com/" target="_blank">moment&nbsp;</a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;// &nbsp;处理日期类库</li>
	<li><a href="https://www.mongodb.com/" target="_blank">MongoDB </a>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; // &nbsp;非关系文档型数据库</li>
</ul>

<h2><strong>项目结构</strong></h2>

<p><img alt="" height="454" src="https://static.oschina.net/uploads/space/2017/0816/145038_3BIB_2352818.png" width="299" /></p>

<h2><strong>实现功能</strong></h2>

<h3>&nbsp;&nbsp;&nbsp;&nbsp;1. 爬公众号文章</h3>

<p>&nbsp;&nbsp;&nbsp;&nbsp;爬公众号有两种方式，一种是直接爬微信官方的文章，另一种是爬<a href="http://weixin.sogou.com/" target="_blank">搜狗微信</a>收录的公众号和文章。</p>

<ul>
	<li>
	<h4>直接爬微信官方内容</h4>
	</li>
</ul>

<p>&nbsp; &nbsp; 微信公众号的历史文章的页面一般在微信客户端打开，如果用浏览器打开链接要保证3个参数正确才能正常访问：</p>

<p>&nbsp;&nbsp;&nbsp;&nbsp;用fidder抓包，公众号历史文章的链接如：</p>

<pre>
<code class="language-http">https://mp.weixin.qq.com/mp/profile_ext?action=home&amp;__biz=MzIyMjMyMjQxOA==&amp;uin=NTMwMTIwMzYw&amp;key=c969774f949c279b04f6d5084dcc41c47b7adcf46689aa839d41edb7d3eb36a026a3e581d86801b637423c65384b5b578318947f1fa7ead227a79ec4dd5e6181172e35f2a2644483b00c5040f7de30f0</code></pre>

<p>&nbsp; &nbsp; 其中关键的3个参数：</p>

<pre>
__biz : &#39;MzIyMjMyMjQxOA==&#39;, // 公众号id，base64加密
  uin : &#39;NTMwMTIwMzYw&#39;,  // 固定值
  key : &#39;c969774f949c279b04f6d5084dcc41c47b7adcf46689aa839d41edb7d3eb36a026a3e581d86801b637423c65384b5b578318947f1fa7ead227a79ec4dd5e6181172e35f2a2644483b00c5040f7de30f0&#39;  // key有时效性，会过期</pre>

<p>&nbsp; &nbsp; 最难的是key这个参数，160位的字符串，有时效性，一段时间后会过期，考虑过可能是160位加密算法，也可能是5个32位加密组合，没研究出来，就没继续研究了 。微信内置的浏览器有私有的接口WeixinJSBridge，可能是调用这个接口生成key。</p>

<ul>
	<li>
	<h4>爬<a href="http://weixin.sogou.com/" target="_blank">搜狗微信</a>收录的公众号和文章</h4>
	</li>
</ul>

<p>&nbsp; &nbsp; 爬搜狗微信比爬微信容易，但有几个问题也是比较麻烦的：</p>

<p>&nbsp; &nbsp; 1）搜狗微信中的公众号历史文章链接和文章链接也有时效性，会超时，有效时间大概是一天左右，所以不能直接保存公众号历史文章链接用于下次直接爬，采取的策略是每次爬文章，要先搜索这个公众号，然后获取这个公众号的历史文章链接，再访问历史文章链接获取历史文章列表，解析最新的文章，同时把之前保存的文章链接也进行更新，一般只更新这几天的文章，太久以前的文章没必要更新。（采用保存网页链接而不是保存整个网页是因为没这么大的储存，土豪请随意~）</p>

<p>&nbsp; &nbsp; 2）爬取过多会要求输入验证码，考虑下面2种方式</p>

<ul>
	<li>
	<p>验证码自动识别：采用opencv对验证码图片进行预处理，用tesseract进行文字识别，nodejs也有支持这两个技术的第三方类库，<strong><a href="https://github.com/peterbraden/node-opencv" target="_blank">node-opencv</a>&nbsp;</strong>和&nbsp;<strong><a href="https://www.npmjs.com/package/node-tesseract" target="_blank">node-tesseract</a>，</strong>因为微信的验证码是重叠的，识别的效果不理想，有时间再研究研究吧。</p>
	</li>
	<li>
	<p>用户填写验证码：当出现需要输入验证码的时候，提示正在使用程序的用户输入验证码，让用户帮忙填写验证码，让爬虫程序能够正常采集。</p>
	</li>
</ul>

<p>&nbsp; &nbsp; 3）微信头像和图片外链不能正常显示：在html中加入标签 &nbsp;&lt;meta name=&quot;referrer&quot; content=&quot;never&quot;&gt; 可以解决图片不能外链的问题。</p>

<h3>&nbsp; &nbsp; 2. 查看文章</h3>

<ul>
	<li>浏览文章：按时间显示最新发布的文章，大图显示文章</li>
</ul>

<p><img alt="" height="525" src="https://static.oschina.net/uploads/space/2017/0817/145728_cPRs_2352818.gif" width="310" /></p>

<ul>
	<li>按公众号分类查看文章：可以在公众号管理功能中自定义公众号分类，在文章列表中按公众号的类别进行分类显示</li>
</ul>

<p><img alt="" height="525" src="https://static.oschina.net/uploads/space/2017/0817/145244_8JKX_2352818.gif" width="309" /></p>

<ul>
	<li>搜索文章：按关键字搜索文章，实际上调用搜狗微信的搜索接口来爬文章</li>
</ul>

<p><img alt="" height="525" src="https://static.oschina.net/uploads/space/2017/0817/171647_IhwS_2352818.gif" width="305" /></p>

<h3>&nbsp; &nbsp; 3. 管理公众号</h3>

<ul>
	<li>搜索公众号：按关键字搜索公众号，可以对自己感兴趣的公众号进行搜索并关注，实际上调用搜狗微信的搜索接口来爬公众号信息</li>
</ul>

<p><img alt="" height="525" src="https://static.oschina.net/uploads/space/2017/0817/150156_4fsS_2352818.gif" width="307" /></p>

<ul>
	<li>关注/取消关注公众号：在公众号管理功能中可以对公众号进行关注和取消关注的操作，文章列表只显示已关注的公众号的文章，方便对不再感兴趣的公众号进行过滤。同时也保留之前关注过的公众号，方便以后再进行关注。</li>
</ul>

<p><img alt="" height="525" src="https://static.oschina.net/uploads/space/2017/0817/150750_NTtc_2352818.gif" width="307" /></p>

<ul>
	<li>公众号自定义分类：可以对公众号自定义分类，文章列表会按照公众号类型进行分类浏览</li>
</ul>

<p><img alt="" height="525" src="https://static.oschina.net/uploads/space/2017/0817/153016_X7oy_2352818.gif" width="312" /></p>

<h3>&nbsp; &nbsp; 4. 登录注册</h3>

<ul>
	<li>使用帐号密码注册和登录，后面考虑使用微信用户授权，减去繁琐的注册登录操作。</li>
</ul>

<p><img alt="" height="523" src="https://static.oschina.net/uploads/space/2017/0817/161212_jMEj_2352818.png" width="304" /></p>

<h2><strong>后续完善</strong></h2>

<p>&nbsp;&nbsp;&nbsp;&nbsp;租了AWS免费云服务，服务器在国外，网速太慢了，有需要再租个国内的云服务部署，不过没经过严格测试一上线肯定很多问题。后面考虑把程序发布在公众号中，可以在微信上使用，支持微信用户授权，不使用帐号密码登录的方式。还有好多问题没考虑到的，而且还有好多想法，后面有时间再完善完善吧。</p>
