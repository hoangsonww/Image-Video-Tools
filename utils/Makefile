# Makefile

IMAGE_NAME := image-video-tools
TAG        := latest
CONTAINER  := ivt-container
PORT       := 8080

.PHONY: build run stop logs clean

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

run:
	docker run -d --name $(CONTAINER) -p $(PORT):80 $(IMAGE_NAME):$(TAG)

stop:
	-if docker stop $(CONTAINER); then docker rm $(CONTAINER); fi

logs:
	docker logs -f $(CONTAINER)

clean: stop
	-docker rmi $(IMAGE_NAME):$(TAG)

