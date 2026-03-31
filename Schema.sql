
create table Projects(
    project_id int generated always as identity primary key,
    name text not null,
    description text not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp

);

create table Labels(
    label_id int generated always as identity primary key,
    name varchar(255) not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp
);


create table Time_entries(
    time_entry_id int generated always as identity primary key,
    project_id int not null,
    start_time timestamp not null,
    end_time timestamp not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp,
    foreign key (project_id) references Projects(project_id) 
);


create table time_entry_label(
    primary key (time_entry_id, label_id),
    time_entry_id int not null,
    label_id int not null,
    foreign key (time_entry_id) references Time_entries(time_entry_id),
    foreign key (label_id) references Labels(label_id)
);

