# “问卷星球”需求描述文档 2021.8.20 1 “问卷星球”需求描述文档  

<center>2021.8.20 —— ART 软件研究所</center> 

​		本公司需要一款问卷收集平台，用于公司的问卷搜集调查。该软件名称不做硬性的要求， 代号为“问卷星球”。该平台应该具备最基本的发布问卷、管理问卷、填写问卷的功能，同 时，他应该关注于站在用户的角度，注重用户的**隐私性**、**操作方便性**等。

##  一、管理问卷

​		在管理问卷界面中，用户能直观地看到他发过的所有问卷。这个页面可以用列表的形式 来呈现问卷，但重要的是直观。

​		例如，用户可以看到问卷现在的状态，包括但不限于**标题、 发布时间、回收量**。此外，用户可以在该页面对问卷进行一些简单的操作，例如**排序、搜索、 预览、复制、删除、开启/关闭问卷、导出问卷**，对此不进行强制要求，并且在下面列出一 些操作描述，同学们可以自行发挥。  

* 排序：系统应该提供基础的排序，例如发布时间、创建时间、问卷回收量等。  
* 搜索：考虑到用户的问卷可能非常多，系统应该能根据关键词来搜索对应的问卷，以便 用户找到想看的问卷。  
* 预览：系统应该提供预览按钮，给用户预览自己创建的问卷；预览的时候应该尽可能和 发布后查看问卷的界面和内容相同，这样能给用户一些参照，用户也可以针对其中一些 地方来进行调整。  
* 复制：系统应该提供按钮来创建问卷的副本。  
* 删除：系统应该提供删除按钮。如果可以的话，可以有一个回收站以便恢复不小心删除 的问卷。  开启/关闭问卷：问卷可以随时开启和关闭。  
* 导出问卷：问卷可以导出到 word 或者 pdf，方便用户保存。

## 二、普通问卷 

​		用户可以对具体的问卷内容进行编辑，而且编辑操作要尽可能简便，不能有大量繁琐的操作。

​		普通问卷应该包括但不限于**单选题、多选题、填空题、评分题**这四个题目类型（更多题 目类型可以参考链接中的网站）。 

​		在编辑问卷的整体过程中，用户应该能对题目进行**添加、复制、删除、调整顺序**等操作， 用户也应该可以为整个页面的题目**自动插入题号**。 

​		针对单个题目组件，用户应该可以**编辑题目与描述**等必要信息，并设置题目**是否必填**等逻辑信息。 在编辑过程中，用户应该可以**随时选择保存和发布问卷**。发布问卷的形式可以有**链接和二维码**。

​		考虑到有些问卷可能只给一部分的人回答，那么链接或者二维码有可能会泄露给其他人，所以系统应该给出相关的解决方案。 

## 三、问卷数据统计分析 

​		用户可以查看问卷收集结果。对于不同的题型，用户应该可以看到**直观的图表分析数据**。 需要注意的是，图表应该是有意义的，而不是随意把几个数据放在图中或者表中。此外，用 户还应该可以进行交叉分析来分析不同数据之间的关系。 最后，用户还可以**导出**收集的数据，方便其进行保存和备份。 

## 四、其他问卷类型 

除普通问卷外，用户应该可以创建不同类型的问卷来满足个性化的信息收集，包括考试 问卷、投票问卷、报名问卷等。 

①投票问卷 用于公开的意见征集，填写者应该能在提交问卷后看到当前问卷的投票结果。 

②报名问卷 用于活动报名，发布者应该可以设计次数限制来限制报名人数，次数限制可以是针对问 卷整体的，也可以是针对某个题目选项的。如图 1，在一道题目中，每个选项有自己的次数 限制。当某个选项的限额为 0 后，后续填写者将无法选择该选项，所有选项限额都为 0 后， 问卷应停止收集。 

③考试问卷 主要用于课堂测试等场景，发布者应该可以设置每道题目的评分和答案，也可以设置问 卷整体的限时时间，超时将自动回收。针对填写者，问卷题目应该可以乱序展示，在填写者 提交后，问卷应该可以对客观题目进行自动评分，并使填写者可以查看答案。 



参考链接 麦客表单：http://www.mikecrm.com/ 问卷星：https://www.wjx.cn/ 腾讯问卷：https://wj.qq.com/