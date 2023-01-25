# Generated by Django 3.1.7 on 2022-04-12 18:19

from django.db import migrations
import django_quill.fields


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0007_provider_index_traffic'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='aggregator',
            options={'verbose_name': 'Агрегатор', 'verbose_name_plural': 'Агрегаторы'},
        ),
        migrations.AlterModelOptions(
            name='announsmenttype',
            options={'verbose_name': 'Тип анонса', 'verbose_name_plural': 'Типы анонсов'},
        ),
        migrations.AlterModelOptions(
            name='providerdomain',
            options={'verbose_name': 'Домен', 'verbose_name_plural': 'Домены'},
        ),
        migrations.AlterModelOptions(
            name='providerkeyword',
            options={'verbose_name': 'Ключевое словo', 'verbose_name_plural': 'Ключевые слова'},
        ),
        migrations.AlterModelOptions(
            name='providerpublicationformat',
            options={'verbose_name': 'Формат публикации', 'verbose_name_plural': 'Форматы публикаций'},
        ),
        migrations.AlterModelOptions(
            name='providertheme',
            options={'verbose_name': 'Тематика', 'verbose_name_plural': 'Тематики'},
        ),
        migrations.AlterModelOptions(
            name='providertype',
            options={'verbose_name': 'Тип СМИ', 'verbose_name_plural': 'Типы СМИ'},
        ),
        migrations.AlterModelOptions(
            name='publicationtheme',
            options={'verbose_name': 'Тема публикации', 'verbose_name_plural': 'Темы публикаций'},
        ),
        migrations.AddField(
            model_name='provider',
            name='description',
            field=django_quill.fields.QuillField(null=True),
        ),
    ]
