
all:
	cordova run electron --nobuild

push:
	(cd www && tar -czf - *) | ssh $(WEBSITEFTP) 'cd sites/savagnier.com/ && tar -xvzf -'
