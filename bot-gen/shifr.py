from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import base64
import os

def encrypt_aes(input_data, key, iv):
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(input_data.encode()) + padder.finalize()
    
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
    return encrypted_data

def decrypt_aes(encrypted_data, key, iv):
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    
    decrypted_padded_data = decryptor.update(encrypted_data) + decryptor.finalize()
    
    unpadder = padding.PKCS7(128).unpadder()
    unpadded_data = unpadder.update(decrypted_padded_data) + unpadder.finalize()
    return unpadded_data.decode()

def encrypt_string(input_string):
    key1 = os.urandom(32)  
    iv1 = os.urandom(16)   
    encrypted_data1 = encrypt_aes(input_string, key1, iv1)
    
    # Добавляем ключи и IV к зашифрованным данным
    combined_data = encrypted_data1 + key1 + iv1
    
    # Шифруем всё вместе (для демонстрации)
    key2 = os.urandom(32)  
    iv2 = os.urandom(16)   
    encrypted_data2 = encrypt_aes(combined_data, key2, iv2)
    
    # Добавляем ключи и IV второго слоя
    combined_data2 = encrypted_data2 + key2 + iv2
    
    # Кодируем всё в Base64
    encrypted_base64 = base64.b64encode(combined_data2).decode()
    
    return encrypted_base64

def decrypt_string(encrypted_base64):
    # Декодируем из Base64
    encrypted_data = base64.b64decode(encrypted_base64)
    
    # Извлекаем ключи и IV второго слоя
    key2 = encrypted_data[-64:-32]
    iv2 = encrypted_data[-32:]
    encrypted_data2 = encrypted_data[:-64]
    
    # Расшифровываем второй слой
    decrypted_data2 = decrypt_aes(encrypted_data2, key2, iv2)
    
    # Извлекаем ключи и IV первого слоя
    key1 = decrypted_data2[-64:-32]
    iv1 = decrypted_data2[-32:-16]
    encrypted_data1 = decrypted_data2[:-64]
    
    # Расшифровываем первый слой
    decrypted_string = decrypt_aes(encrypted_data1, key1, iv1)
    
    return decrypted_string

def main():
    print("Выберите действие:")
    print("1 - Зашифровать строку")
    print("2 - Расшифровать строку")
    
    choice = input("Ваш выбор: ").strip()
    
    if choice == '1':
        input_string = input("Введите строку для шифрования: ").strip()
        encrypted_base64 = encrypt_string(input_string)
        print("\nЗашифрованная строка (Base64):")
        print(encrypted_base64)
    
    elif choice == '2':
        encrypted_base64 = input("Введите зашифрованную строку (Base64): ").strip()
        decrypted_string = decrypt_string(encrypted_base64)
        print("\nРасшифрованная строка:")
        print(decrypted_string)
    
    else:
        print("Неверный выбор. Попробуйте снова.")

if __name__ == "__main__":
    main()
