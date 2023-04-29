FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y apache2 libapache2-mod-wsgi-py3 python3 python3-pip supervisor

RUN a2enmod wsgi

COPY . /var/www/html/

RUN pip3 install -r /var/www/html/requirements.txt

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN a2ensite 000-default
RUN service apache2 restart

EXPOSE 80
EXPOSE 5001

CMD ["/usr/bin/supervisord"]
