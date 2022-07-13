from sqlalchemy.orm import Session
import models
import schemas

def getProjectbyProjectId(db:Session, project_id: str):
    return db.query(models.Projects).filter(models.Projects.project_id == project_id).first()

def getProjects(db:Session, skip: int = 0, limit: int = 100):
    return db.query(models.Projects).offset(skip).limit(limit).all()

def getProjectsById(db:Session, sl_id: str):
    return db.query(models.Projects).filter(models.Projects.id == sl_id).first() 

def newProject(db:Session, proj: schemas.ProjectAdd):
    project_details = models.Projects(
        project_id = proj.project_id,
        project_name = proj.project_name,
        students = proj.students,
        area = proj.area,
        course = proj.course,
        create_date = proj.create_date,
        description = proj.description,
        techs = proj.techs,
        contact = proj.contact,
        finish_ratio = proj.finish_ratio,
        status = proj.status,
    )
    db.add(project_details)
    db.commit()
    db.refresh(project_details)
    return models.Projects(**proj.dict())

def updateProject(db:Session, sl_id: str, details: schemas.UpdateProject):
    db.query(models.Projects).filter(models.Projects.id == sl_id).update(vars(details))
    db.commit()
    return db.query(models.Monkeys).filter(models.Projects.id == sl_id).first()

def deleteProject(db:Session, sl_id: str):
    try:
        db.query(models.Projects).filter(models.Projects.id == sl_id).delete()
        db.commit()
    except Exception as e:
        raise Exception(e)

