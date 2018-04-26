.PHONY: all main clean lint lessc

all: lessc lint main

clean:
	rm -rf node_modules

install:
	npm i


main:
	webpack


lint:
	jshint --verbose src/*.js


lessc:
	lessc src/style.less css/style.css



