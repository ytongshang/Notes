- 安装Homebrew,[网站](http://brew.sh/)

  ```
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  ```

- 安装 使用brew 安装git等

  ```
  brew install git
  ```

- 安装brew cask

  ```
  brew tap phinze/homebrew-cask
  brew install brew-cask
  ```

- 使用brew cask 安装java atom chrome 等等

  ```
  brew cask install java
  brew cask install atom
  brew cask install google-chrome
  brew cask install alfred
  brew cask install dash
  ```

- 安装iterm2使用brew cask安装item2

  ```
  brew cask install iterm
  ```

- zsh 安装新版本的zsh

  ```
  brew install zsh
  ```

- 安装oh my zsh

  1. zsh文章 <https://segmentfault.com/a/1190000002658335?_ea=438459>
  2. 安装oh my zash

    ```
    git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
    ```

  3. 创建一个zsh的配置文件

    ```
    touch ~/.zshrc
    ```

  4. 如果原来使用过zsh,备份原来的zsh的配置文件

    ```
    cp ~/.zshrc ~/.zshrc.orig
    ```

  5. 复制 zsh 模板到配置文件中

    ```
    cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
    ```

  6. unix，linux,osx中将shell切换到zsh

    ```
    chsh -s /bin/zsh
    ```

    windows使用cygwin时，在~/.bash_profile中加入zsh

    ```
    exec zsh
    ```

  7. 修改zsh 主题 ，编辑 ~/.zshrc，主题文件在 ~/.oh-my-zsh/themes 目录

    ```
    ZSH_THEME=y
    ```

  8. 安装autojump

    ```
    git clone https://github.com/wting/autojump
    cd autojump
    python install.py
    ```

    添加执行install.py生成的代码到~/.zshrc

    ```
    source .zshrc
    ```

    重启shell

  8.
