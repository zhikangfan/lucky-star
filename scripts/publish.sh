#!/bin/bash
#切换到项目根目录
cd "$(dirname "$0")"/..

# 加载nvm环境
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 这将加载nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # 这将加载nvm bash_completion

nvm use
npm run build
scp -r dist/* root@47.101.31.109:/home/wwwroot/lucky/
