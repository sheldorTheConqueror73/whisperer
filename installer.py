import sys
from condig import config


class Evn:
    OS = None
    DIR = None
    SETTINGS_DIR = None
    File = None


def clac_os():
    Evn.OS = sys.platform()
    if Evn.OS == 'linux' or Evn.OS == 'linux2':
        Evn.DIR = '~/opt/whisperer'
        Evn.SETTINGS_DIR = '~/config'
        Evn.File = ''
    elif Evn.OS == 'win32':
        Evn.DIR = 'C;\\Program Files\\whisperer\\'
        Evn.SETTINGS_DIR = '%AppData%'
        Evn.File = Evn.SETTINGS_DIR + 'config.bin'


def install():
    clac_os()
    config()
    # copy main to dir
