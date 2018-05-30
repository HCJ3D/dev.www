<?php
namespace Application\Controller;

use LeoGalleguillos\ThreeDimensions\Model\Table as ThreeDimensionsTable;
use LeoGalleguillos\User\Model\Factory as UserFactory;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class Mannequin extends AbstractActionController
{
    public function __construct(
        ThreeDimensionsTable\Mannequin $mannequinTable,
        UserFactory\User\BuildFromCookies $buildFromCookiesFactory
    ) {
        $this->mannequinTable          = $mannequinTable;
        $this->buildFromCookiesFactory = $buildFromCookiesFactory;
    }

    public function updateWhereUserIdAction()
    {
        $userEntity  = $this->buildFromCookiesFactory->buildFromCookies();
        $this->mannequinTable->updateWhereUserId(
            $_POST['translateX'],
            $_POST['translateY'],
            $_POST['translateZ'],
            $_POST['rotateX'],
            $_POST['rotateY'],
            $_POST['rotateZ'],
            $_POST['transformOriginX'],
            $_POST['transformOriginY'],
            $_POST['transformOriginZ'],
            $userEntity->getUserId()
        );

        $viewModel = new ViewModel();
        $viewModel->setTerminal(true);
        return $viewModel;
    }
}
