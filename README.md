# SSNoC-Emergency Chat Room
A life saving local SSN project that is enbeded in in beagleboard black.

## Ⅰ. Github manual for Sawyer 

>###⒈ Download project from github

>>>>`cd xxx`(your dir)<br> 
>>>>`git clone https://github.com/cmusv-fse/xxx`<br> 
>>>>`cd xxx(your dir)`<br> 
>>>>`npm install`   (if you want to use new package, please use command `npm install xxx --save`, so that the package would be wrote to package.jason)<br> 

>###⒉ Create a dev branch and submit your code in a safe way

>>####❶. Creat a dev branch and make sure `you are coding under dev branch`
>>>>`git checkout -b dev`     -(create dev branch and switch to dev branch)<br> 
>>>>`git branch`              -(list branches in your computer and check now which branch are you in. Manek sure every time >>>>>>>before you want to modify code, `type this command first to make sure you are under dev branch`. if not, use command git >>>>>>>checkout branch dev)<br> 

>>####❷. Submit code by using dev branch
>>>##### ⅰ.Switch to master and pull code first
>>>>`git checkout master`<br> 
>>>>`git pull origin master`
>>>##### ⅱ.Switch to dev and make a commit for your modified code
>>>>`git checkout dev`<br> 
>>>>(modify your code on dev)<br> 
>>>>`git status` (list all files you changed)<br> 
>>>>`git add  xxx`(add all fiels you changed)<br> 
>>>>`git commit -m "(add your commit)"`<br> 
>>>##### ⅲ. Switch to master and merge dev code to master
>>>>`git checkout master`<br> 
>>>>`git merge dev`<br> 
>>>##### ⅳ. Submit your code to github
>>>>`git status`<br> 
>>>>`git add  xxx`<br> 
>>>>`git commit -m "(add your commit)"`<br> 
>>>>`git push origin master`<br> 


##Ⅱ. Run your code 
>>>>`cd xxx(root)`<br> 
>>>>`git initdb.js`(if you want to clean your db. if not, omit this step)<br> 
>>>>`cd xxx/controllers`<br> 
>>>>`node app.js 8888`<br> 

##Ⅲ. Run RESTful
>>>>`cd xxx.comtrollers`<br> 
>>>>`node restful.js 7777`<br> 

######@Joan
