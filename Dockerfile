FROM node:0.12.0-wheezy
MAINTAINER Laurent Prevost <laurent.prevost@heig-vd.ch>

# For later use when bower will be reintroduced
RUN npm install -g bower

# See: http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/ (similar approach for bower)
ADD bower.json /tmp/bower.json
RUN cd /tmp && bower install --allow-root
RUN mkdir -p /nodejs/mapbox-viewer/public && cp -a /tmp/bower_components /nodejs/mapbox-viewer/public

# See: http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /nodejs/mapbox-viewer

ADD . /nodejs/mapbox-viewer

RUN useradd -m -r -U mapbox \
	&& chown -R mapbox:mapbox /nodejs/mapbox-viewer

USER mapbox

WORKDIR /nodejs/mapbox-viewer

EXPOSE 3000

CMD ["npm", "start"]