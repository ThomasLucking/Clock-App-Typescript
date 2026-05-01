drop table Labels cascade;

create table Projects(
    project_id int generated always as identity primary key,
    name varchar(255) not null,
    description text not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp

);

create table Labels(
    label_id int generated always as identity primary key,
    name varchar(255) not null,
    color varchar(255) not null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp
);


create table Time_entries(
    time_entry_id int generated always as identity primary key,
    project_id int not null,
    description text not null,
    start_time timestamptz not null,
    end_time timestamptz null,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    foreign key (project_id) references Projects(project_id) on delete cascade,
    constraint check_times check (end_time >= start_time)
);


create table Time_entry_labels(
    primary key (time_entry_id, label_id),
    time_entry_id int not null,
    label_id int not null,
    foreign key (time_entry_id) references Time_entries(time_entry_id) on delete cascade,
    foreign key (label_id) references Labels(label_id) on delete cascade
);


create index idx_time_entries_project_id on Time_entries(project_id);
create index idx_time_entry_labels_label_id on Time_entry_labels(label_id);


create unique index one_active_entry 
on Time_entries ((end_time is null)) 
where end_time is null

