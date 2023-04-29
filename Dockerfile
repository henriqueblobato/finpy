FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y apache2 libapache2-mod-wsgi-py3 python3 python3-pip supervisor

# Configure Apache to load WSGI module
RUN a2enmod wsgi

# Copy Flask app files
COPY . /var/www/html/

# Install Flask app dependencies
RUN pip3 install -r /var/www/html/requirements.txt

# Copy supervisord configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy Apache configuration file
# COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Enable Apache site and restart Apache
RUN a2ensite 000-default && \
    service apache2 restart

# Expose Apache and Flask ports
EXPOSE 80
EXPOSE 5001

CMD ["/usr/bin/supervisord"]
