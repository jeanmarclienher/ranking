
all:
	cordova run electron --nobuild

push:
	(cd www && tar -czf - *) | ssh $(WEBSITEFTP) 'cd sites/savagnier.com/ && tar -xvzf -'

init:
	npm update -g
	npm install -g  cordova
	cordova platform add electron

