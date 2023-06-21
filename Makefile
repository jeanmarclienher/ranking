
all: run


build:
	cordova build electron --release

run:
	cordova run electron --nobuild
	
push:
	(cd www && tar -czf - *) | ssh $(WEBSITEFTP) 'cd sites/savagnier.com/ && tar -xvzf -'

wininit:
	@echo please install Node.js https://nodejs.org/en/download
	apt install npm
	npm update -g
	npm install -g  cordova
	cordova  platform add electron

init:
	sudo apt install npm
	sudo npm update -g
	sudo npm install -g  cordova
	cordova -d platform add electron

clean:
	rm -rf node_modules package-lock.json plugins platforms

