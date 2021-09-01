
def input_handler(msg, mode=0):
    if mode == 0:
        confirm = str(input(msg))
        if confirm == 'Y' or confirm == 'y':
            return True
        return False
    elif mode == 1:
        while (True):
            choice = eval(input(msg))
            if isinstance(choice, int):
                return choice
            print("Invalid input, Please enter an integer")
    elif mode == 2:
        addr = str(input(msg))
        # check email valid
        return addr

def argument_handler():
    return None
