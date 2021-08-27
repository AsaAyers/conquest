#!/bin/bash

# https://github.com/ruimarinho/gsts/issues/26#issuecomment-673779760

export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0 

npm test -- --puppeteer-executable-path=/usr/bin/chromium 