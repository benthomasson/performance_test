
.PHONY: all main


all: main deploy


main:
	npm run build

deploy:
	rsync -av build/static/ ../performance_test/static/
	rsync -v build/* ../performance_test/static/
	rsync -v build/index.html ../performance_test/templates/performance_test/
