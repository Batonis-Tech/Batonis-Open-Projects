# Generated by Django 3.1.7 on 2022-04-28 10:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0010_auto_20220428_1053'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='type',
            field=models.CharField(choices=[('', ''), ('Заморожено', 'Заморожено'), ('Разморожено', 'Разморожено'), ('Оплата', 'Оплата'), ('Вывод средств', 'Вывод средств'), ('Начисление средств', 'Начисление средств'), ('Комиссия', 'Комиссия')], default='', max_length=255),
        ),
    ]
