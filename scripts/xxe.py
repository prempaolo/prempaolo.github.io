#!/usr/bin/python

import sys, getopt
import requests
from bs4 import BeautifulSoup

def main(argv):
    req = ''
    try:
        opts, args = getopt.getopt(argv,"hr:",["request-file="])
    except getopt.GetoptError:
        print('xxe.py -r <request-file>')
        sys.exit(2)
    if not opts:
        print('xxe.py -r <request-file>')
        sys.exit()
    for opt, arg in opts:
        if opt == '-h':
            print('xxe.py -r <request-file>')
            sys.exit()
        elif opt in ("-r", "--request"):
            req = arg

    file = open(req, "r")
    for line in file:
        if not line.isspace():
            args = line.split(":")
            key = args[0]
            value = ""
            if len(args)!=1:
                value = args[1]
            print(key)
            print(value)
    # html_text = requests.get(url).text
    # soup = BeautifulSoup(html_text, 'html.parser')

    # for form in soup.find_all('form'):
        # print(form)


if __name__ == "__main__":
    main(sys.argv[1:])
