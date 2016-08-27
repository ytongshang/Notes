* 安装Homebrew,网站http://brew.sh/
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

* 安装 使用brew 安装git等
```
brew install git
```

* 安装brew cask
```
brew tap phinze/homebrew-cask
brew install brew-cask
```

* 使用brew cask 安装java atom chrome 等等
```
brew cask install java
brew cask install atom
brew cask install google-chrome
brew cask install iterm2
brew cask install alfred
```

* 安装iterm2使用brew cask安装item2
```
brew cask install iterm
```

* zsh 安装新版本的zsh
```
brew install zsh
```

* 安装oh my zsh
  1. 安装zash
  ```
  git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
  ```
  2. 创建一个zsh的配置文件
  ```
  touch ~/.zshrc
  ```
  3. 如果原来使用过zsh,备份zsh的配置文件
  ```
  cp ~/.zshrc ~/.zshrc.orig
  ```
  4. 复制 zsh 模板到配置文件中
  ```
  cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
  ```  
  5. bash切换到zsh
  ```
  chsh -s /bin/zsh
  ```
  6. 修改zsh 主题 ，编辑 ~/.zshrc，主题文件在 ~/.oh-my-zsh/themes 目录
  ```
  ZSH_THEME=ys
  ```
